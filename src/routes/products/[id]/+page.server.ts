import { error, fail, redirect } from '@sveltejs/kit';
import { query } from '#lib/server/db.ts';
import { id } from '#lib/server/shop.ts';
import { requireUser } from '#lib/server/auth.ts';
export async function load({ params }: import('./$types').PageServerLoadEvent) {
	const product = (
		await query(
			'SELECT id,name,description,price,color,category,is_flag FROM products WHERE id=$1',
			[id(params.id)]
		)
	).rows[0];
	if (!product) error(404, 'Produkt nicht gefunden');
	return { product };
}
export const actions = {
	default: async ({ params, locals }) => {
		const user = requireUser(locals);
		const product = (await query('SELECT id FROM products WHERE id=$1', [id(params.id)])).rows[0];
		if (!product) error(404, 'Produkt nicht gefunden');
		const result = await query(
			`INSERT INTO cart_items VALUES ($1,$2,1) ON CONFLICT(user_id,product_id) DO UPDATE SET quantity=cart_items.quantity+1 WHERE cart_items.quantity<99 RETURNING quantity`,
			[user.id, product.id]
		);
		if (!result.rowCount) return fail(400, { message: 'Maximal 99 Stück pro Produkt.' });
		redirect(303, '/cart');
	}
};
