import { error } from '@sveltejs/kit';
import { query } from './db';
export function id(value: unknown) {
	const n = Number(value);
	if (!Number.isSafeInteger(n) || n < 1) error(404, 'Produkt nicht gefunden');
	return n;
}
export async function cart(userId: number) {
	const items = (
		await query(
			'SELECT p.id,p.name,p.description,p.price,p.color,p.category,p.is_flag,c.quantity FROM cart_items c JOIN products p ON p.id=c.product_id WHERE c.user_id=$1 ORDER BY p.id',
			[userId]
		)
	).rows;
	const subtotal = items.reduce((s, p) => s + p.price * p.quantity, 0);
	const coupons = (
		await query(
			'SELECT cc.id,cc.code,c.percent FROM cart_coupons cc JOIN coupons c ON c.code=cc.code WHERE user_id=$1 ORDER BY cc.id',
			[userId]
		)
	).rows.map((c) => ({ ...c, amount: Math.floor((subtotal * c.percent) / 100) }));
	return {
		items,
		coupons,
		subtotal,
		total: Math.max(0, subtotal - coupons.reduce((s, c) => s + c.amount, 0))
	};
}
