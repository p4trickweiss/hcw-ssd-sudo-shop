import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
let initialized: boolean;
try {
	const result = await pool.query("SELECT to_regclass('public.users') IS NOT NULL AS initialized");
	initialized = result.rows[0].initialized;
} finally {
	await pool.end();
}

if (initialized) {
	console.log('Datenbank bereits initialisiert. Vorhandene Daten bleiben erhalten.');
} else {
	await import('./reset.ts');
}
