import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { query } from '#lib/server/db.ts';
import { requireUser, hash, token, rateLimit } from '#lib/server/auth.ts';
export async function load({ locals }: import('./$types').PageServerLoadEvent) {
	if (!locals.user) return { solves: [], attack: null };
	const user = locals.user;
	const attack =
		(
			await query(
				`SELECT token,leaked_note FROM xss_tokens WHERE attacker_id=$1 AND created_at>NOW()-INTERVAL '24 hours' ORDER BY created_at DESC LIMIT 1`,
				[user.id]
			)
		).rows[0] ?? null;
	if (attack?.leaked_note) attack.flag = attack.leaked_note.match(/SUDO\{[^}]+\}/)?.[0] ?? '';
	return {
		solves: (await query('SELECT challenge_id FROM solves WHERE user_id=$1', [user.id])).rows.map(
			(r) => r.challenge_id
		),
		attack
	};
}
export const actions = {
	submit: async ({ locals, request }) => {
		const user = requireUser(locals);
		if (rateLimit('flag:' + user.id))
			return fail(429, { message: 'Zu viele Versuche. Bitte warte eine Minute.' });
		const parsed = z
			.object({ challenge: z.enum(['c1', 'c2', 'c3']), flag: z.string().trim().min(7).max(150) })
			.safeParse(Object.fromEntries(await request.formData()));
		if (!parsed.success) return fail(400, { message: 'Bitte ein gültiges Flag eingeben.' });
		const { challenge, flag } = parsed.data;
		if (
			challenge === 'c2' &&
			!(
				await query('SELECT 1 FROM xss_tokens WHERE attacker_id=$1 AND leaked_note IS NOT NULL', [
					user.id
				])
			).rowCount
		)
			return fail(400, {
				message: 'Für C2 muss zuerst eine Notiz aus Bobs Sitzung im Collector eingehen.'
			});
		const match = (
			await query('SELECT 1 FROM challenges WHERE id=$1 AND flag_hash=$2', [challenge, hash(flag)])
		).rowCount;
		if (!match) return fail(400, { message: 'Falsches Flag. Versuche es erneut.' });
		await query('INSERT INTO solves(user_id,challenge_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [
			user.id,
			challenge
		]);
		return { message: 'Challenge gelöst!', ok: true };
	},
	attack: async ({ locals }) => {
		const user = requireUser(locals);
		if (user.username !== 'alice')
			return fail(403, { message: 'Starte diesen Angriff mit Alice.' });
		if (rateLimit('attack:' + user.id)) return fail(429, { message: 'Bitte warte eine Minute.' });
		await query('INSERT INTO xss_tokens(token,attacker_id) VALUES ($1,$2)', [token(), user.id]);
		return { message: 'Angriffskennung erstellt.', ok: true };
	}
};
