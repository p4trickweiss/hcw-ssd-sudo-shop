import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { query } from '#lib/server/db.ts';
import { verify, token, hash, rateLimit } from '#lib/server/auth.ts';
export const actions = {
	default: async ({ request, cookies, getClientAddress }) => {
		if (rateLimit('login:' + getClientAddress()))
			return fail(429, { message: 'Zu viele Versuche. Bitte warte eine Minute.' });
		const form = Object.fromEntries(await request.formData());
		const parsed = z
			.object({ username: z.string().min(1).max(50), password: z.string().min(1).max(128) })
			.safeParse(form);
		if (!parsed.success) return fail(400, { message: 'Bitte Benutzername und Passwort eingeben.' });
		const user = (await query('SELECT * FROM users WHERE username=$1', [parsed.data.username]))
			.rows[0];
		if (!user || !verify(parsed.data.password, user.password_hash))
			return fail(400, { message: 'Benutzername oder Passwort ist falsch.' });
		const session = token();
		await query('DELETE FROM sessions WHERE expires_at<=NOW()');
		await query("INSERT INTO sessions VALUES ($1,$2,NOW()+INTERVAL '24 hours')", [
			hash(session),
			user.id
		]);
		cookies.set('session', session, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: new URL(request.url).protocol === 'https:',
			maxAge: 86400
		});
		redirect(303, '/products');
	}
};
