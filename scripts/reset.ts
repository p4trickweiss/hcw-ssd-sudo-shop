import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { randomBytes, scryptSync, createHash } from 'node:crypto';
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();
try {
	await client.query('BEGIN');
	await client.query(readFileSync('db/schema.sql', 'utf8'));
	await client.query(readFileSync('db/testdaten.sql', 'utf8'));
	for (const username of ['alice', 'bob']) {
		const salt = randomBytes(16).toString('hex');
		const password_hash = salt + ':' + scryptSync('labubu123', salt, 64).toString('hex');
		await client.query('UPDATE users SET password_hash=$1 WHERE username=$2', [
			password_hash,
			username
		]);
	}
	const path = '/app/local/flags.sql';
	if (!existsSync(path)) {
		const flags = [1, 2, 3].map(() => `SUDO{${randomBytes(16).toString('hex')}}`);
		const sha = (s: string) => createHash('sha256').update(s).digest('hex');
		writeFileSync(
			path,
			`-- Lokal erzeugt; nicht committen.\n` +
				flags
					.map((f, i) => `INSERT INTO challenges(id,flag_hash) VALUES ('c${i + 1}','${sha(f)}');`)
					.join('\n') +
				`\nUPDATE orders SET note='Private Sammlernotiz: ${flags[0]}' WHERE id=1;\nUPDATE users SET private_note=private_note || ' ${flags[1]}' WHERE username='bob';\nUPDATE products SET flag_reward='${flags[2]}' WHERE is_flag=true;\n`,
			{ mode: 0o600 }
		);
	}
	await client.query(readFileSync(path, 'utf8'));
	await client.query('COMMIT');
	console.log('Reset erfolgreich. Testkonten: alice / bob, Passwort jeweils labubu123.');
} catch (e) {
	await client.query('ROLLBACK');
	throw e;
} finally {
	client.release();
	await pool.end();
}
