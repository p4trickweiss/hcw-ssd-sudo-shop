import type { Handle, HandleServerError } from '@sveltejs/kit/hooks';
import { randomBytes, randomUUID } from 'node:crypto';
import { hash } from '#lib/server/auth.ts';
import { query, secure } from '#lib/server/db.ts';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = null;
	const session = event.cookies.get('session');
	if (session) {
		const result = await query(
			`SELECT u.id,u.username,u.balance FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.id=$1 AND s.expires_at>NOW()`,
			[hash(session)]
		);
		event.locals.user = result.rows[0] ?? null;
	}
	const nonce = randomBytes(16).toString('base64');
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace(/<script\b/g, `<script nonce="${nonce}"`)
	});
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'same-origin');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('Cache-Control', 'no-store');
	const scripts =
		event.url.pathname === '/search' && !secure()
			? "'self' 'unsafe-inline'"
			: `'self' 'nonce-${nonce}'`;
	response.headers.set(
		'Content-Security-Policy',
		`default-src 'self'; script-src ${scripts}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws://localhost:* ws://127.0.0.1:*; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`
	);
	return response;
};

export const handleError: HandleServerError = ({ error, kind }) => {
	if (kind !== 'unknown') return;
	const id = randomUUID();
	console.error(id, error);
	return { message: `Ein unerwarteter Fehler ist aufgetreten. Fehler-ID: ${id}` };
};
