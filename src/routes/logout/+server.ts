import { redirect } from '@sveltejs/kit';
import { query } from '#lib/server/db.ts';
import { hash } from '#lib/server/auth.ts';
export async function POST({ cookies }: import('./$types').RequestEvent) {
	const session = cookies.get('session');
	if (session) await query('DELETE FROM sessions WHERE id=$1', [hash(session)]);
	cookies.delete('session', { path: '/' });
	redirect(303, '/login');
}
