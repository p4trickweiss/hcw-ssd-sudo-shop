import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { redirect } from '@sveltejs/kit';

export const hash = (value: string) => createHash('sha256').update(value).digest('hex');

export function verify(password: string, stored: string) {
	const [salt, key] = stored.split(':');
	if (!salt || !key) return false;
	const actual = scryptSync(password, salt, 64);
	const expected = Buffer.from(key, 'hex');
	return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export const token = () => randomBytes(32).toString('hex');

export function requireUser(locals: App.Locals) {
	if (!locals.user) redirect(303, '/login');
	return locals.user;
}

const attempts = new Map<string, { count: number; until: number }>();

export function rateLimit(key: string, max = 15) {
	const now = Date.now();
	for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
	const value = attempts.get(key) ?? { count: 0, until: now + 60_000 };
	value.count++;
	attempts.set(key, value);
	return value.count > max;
}
