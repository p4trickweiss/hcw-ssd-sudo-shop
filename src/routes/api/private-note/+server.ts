import { error } from '@sveltejs/kit';
import { requireUser } from '#lib/server/auth.ts';
import { query } from '#lib/server/db.ts';
export async function GET({ locals }: import('./$types').RequestEvent) {
	const user = requireUser(locals);
	if (user.username !== 'bob') error(403, 'Diese Notiz ist privat.');
	return Response.json({
		note: (await query('SELECT private_note FROM users WHERE id=$1', [user.id])).rows[0]
			.private_note
	});
}
