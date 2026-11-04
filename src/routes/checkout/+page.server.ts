import { fail, redirect } from '@sveltejs/kit';
import { pool, secure } from '#lib/server/db.ts';
import { requireUser } from '#lib/server/auth.ts';
import { cart } from '#lib/server/shop.ts';
export async function load({ locals }: import('./$types').PageServerLoadEvent) {
	return await cart(requireUser(locals).id);
}
export const actions = {
	default: async ({ locals }) => {
		const user = requireUser(locals),
			client = await pool.connect();
		let orderId: number;
		try {
			await client.query('BEGIN');
			const account = (
				await client.query('SELECT balance FROM users WHERE id=$1 FOR UPDATE', [user.id])
			).rows[0];
			const items = (
				await client.query(
					'SELECT p.*,c.quantity FROM cart_items c JOIN products p ON p.id=c.product_id WHERE user_id=$1 ORDER BY p.id FOR UPDATE OF c',
					[user.id]
				)
			).rows;
			if (!items.length) {
				await client.query('ROLLBACK');
				return fail(400, { message: 'Dein Warenkorb ist leer.' });
			}
			const coupons = (
				await client.query(
					'SELECT cc.code,c.percent FROM cart_coupons cc JOIN coupons c ON c.code=cc.code WHERE user_id=$1 ORDER BY cc.id',
					[user.id]
				)
			).rows;
			if (secure() && new Set(coupons.map((c) => c.code)).size !== coupons.length) {
				await client.query('ROLLBACK');
				return fail(400, {
					message: 'Doppelte Gutscheine sind nicht erlaubt. Entferne die Gutscheine im Warenkorb.'
				});
			}
			const subtotal = items.reduce((s, p) => s + p.price * p.quantity, 0);
			const discounts = coupons.map((c) => ({
				...c,
				amount: Math.floor((subtotal * c.percent) / 100)
			}));
			const total = Math.max(0, subtotal - discounts.reduce((s, c) => s + c.amount, 0));
			if (total > account.balance) {
				await client.query('ROLLBACK');
				return fail(400, {
					message: 'Dein fiktives Guthaben reicht für diese Bestellung nicht aus.'
				});
			}
			const reward =
				user.username === 'bob' && items.some((p) => p.is_flag)
					? items.find((p) => p.is_flag).flag_reward
					: '';
			orderId = (
				await client.query(
					'INSERT INTO orders(user_id,total,subtotal,note) VALUES ($1,$2,$3,$4) RETURNING id',
					[user.id, total, subtotal, reward]
				)
			).rows[0].id;
			for (const p of items)
				await client.query(
					'INSERT INTO order_items(order_id,product_id,name,price,quantity) VALUES ($1,$2,$3,$4,$5)',
					[orderId, p.id, p.name, p.price, p.quantity]
				);
			for (const d of discounts)
				await client.query('INSERT INTO order_discounts(order_id,code,amount) VALUES ($1,$2,$3)', [
					orderId,
					d.code,
					d.amount
				]);
			await client.query('UPDATE users SET balance=balance-$1 WHERE id=$2', [total, user.id]);
			await client.query('DELETE FROM cart_items WHERE user_id=$1', [user.id]);
			await client.query('DELETE FROM cart_coupons WHERE user_id=$1', [user.id]);
			await client.query('COMMIT');
		} catch (e) {
			await client.query('ROLLBACK');
			throw e;
		} finally {
			client.release();
		}
		redirect(303, `/orders/${orderId}`);
	}
};
