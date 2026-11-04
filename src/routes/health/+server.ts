import { json } from '@sveltejs/kit';
import { query } from '#lib/server/db.ts';
export async function GET() {
	try {
		await query('SELECT 1');
		return json({ status: 'ok' });
	} catch {
		return json({ status: 'unavailable' }, { status: 503 });
	}
}
