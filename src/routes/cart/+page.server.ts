import { fail } from '@sveltejs/kit';
import { query, pool, secure } from '#lib/server/db.ts';
import { requireUser } from '#lib/server/auth.ts';
import { cart } from '#lib/server/shop.ts';
export async function load({ locals }: import('./$types').PageServerLoadEvent) {
	return await cart(requireUser(locals).id);
}
export const actions = {
	update: async ({ request, locals }) => {
		const user = requireUser(locals),
			form = await request.formData();
		const product = Number(form.get('product_id')),
			quantity = Number(form.get('quantity'));
		if (
			!Number.isSafeInteger(product) ||
			!Number.isInteger(quantity) ||
			quantity < 1 ||
			quantity > 99
		)
			return fail(400, { message: 'Die Menge muss eine ganze Zahl zwischen 1 und 99 sein.' });
		await query('UPDATE cart_items SET quantity=$1 WHERE user_id=$2 AND product_id=$3', [
			quantity,
			user.id,
			product
		]);
		return { message: 'Menge aktualisiert.', ok: true };
	},
	remove: async ({ request, locals }) => {
		const user = requireUser(locals),
			form = await request.formData();
		const product = Number(form.get('product_id'));
		if (!Number.isSafeInteger(product)) return fail(400, { message: 'Ungültiges Produkt.' });
		await query('DELETE FROM cart_items WHERE user_id=$1 AND product_id=$2', [user.id, product]);
		return { message: 'Produkt entfernt.', ok: true };
	},
	coupon: async ({ request, locals }) => {
		const user = requireUser(locals),
			form = await request.formData();
		const code = String(form.get('code') ?? '')
			.trim()
			.toUpperCase();
		const client = await pool.connect();
		try {
			await client.query('BEGIN');
			await client.query('SELECT id FROM users WHERE id=$1 FOR UPDATE', [user.id]);
			if (!(await client.query('SELECT 1 FROM cart_items WHERE user_id=$1', [user.id])).rowCount) {
				await client.query('ROLLBACK');
				return fail(400, { message: 'Lege zuerst ein Produkt in den Warenkorb.' });
			}
			if (!(await client.query('SELECT 1 FROM coupons WHERE code=$1', [code])).rowCount) {
				await client.query('ROLLBACK');
				return fail(400, { message: 'Dieser Gutscheincode ist ungültig.' });
			}
			// C3: Im verwundbaren Modus fehlt die Regel „jeder Code höchstens einmal“.
			if (
				secure() &&
				(
					await client.query('SELECT 1 FROM cart_coupons WHERE user_id=$1 AND code=$2', [
						user.id,
						code
					])
				).rowCount
			) {
				await client.query('ROLLBACK');
				return fail(400, { message: 'Dieser Gutschein wurde bereits eingelöst.' });
			}
			if (
				(await client.query('SELECT 1 FROM cart_coupons WHERE user_id=$1', [user.id])).rowCount! >=
				5
			) {
				await client.query('ROLLBACK');
				return fail(400, { message: 'Es sind bereits fünf Gutscheine hinterlegt.' });
			}
			await client.query('INSERT INTO cart_coupons(user_id,code) VALUES ($1,$2)', [user.id, code]);
			await client.query('COMMIT');
			return { message: 'Gutschein eingelöst.', ok: true };
		} catch (e) {
			await client.query('ROLLBACK');
			throw e;
		} finally {
			client.release();
		}
	},
	clearCoupons: async ({ locals }) => {
		await query('DELETE FROM cart_coupons WHERE user_id=$1', [requireUser(locals).id]);
		return { message: 'Gutscheine entfernt.', ok: true };
	}
};
