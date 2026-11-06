import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { query } from '#lib/server/db.ts';
import { requireUser, rateLimit } from '#lib/server/auth.ts';
export async function POST({ locals, request }: import('./$types').RequestEvent) {
	const user = requireUser(locals);
	if (user.username !== 'bob') error(403, 'Nur die fiktive Opfersitzung kann Daten übermitteln.');
	if (rateLimit('collect:' + user.id, 30)) error(429, 'Bitte warte eine Minute.');
	const parsed = z
		.object({ token: z.string().regex(/^[a-f0-9]{64}$/), note: z.string().max(500) })
		.safeParse(await request.json().catch(() => null));
	if (!parsed.success) error(400, 'Ungültige Challenge-Daten.');
	const result = await query(
		`UPDATE xss_tokens SET leaked_note=$1 WHERE token=$2 AND attacker_id<>$3 AND created_at>NOW()-INTERVAL '24 hours' AND $1=(SELECT private_note FROM users WHERE id=$3) RETURNING token`,
		[parsed.data.note, parsed.data.token, user.id]
	);
	if (!result.rowCount) error(400, 'Angriff oder Notiz ungültig.');
	return Response.json({ ok: true });
}
