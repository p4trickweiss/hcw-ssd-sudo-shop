import { query, secure } from '#lib/server/db.ts';
export async function load({ locals }: import('./$types').LayoutServerLoadEvent) {
	const count = locals.user
		? (
				await query(
					'SELECT COALESCE(SUM(quantity),0)::int AS count FROM cart_items WHERE user_id=$1',
					[locals.user.id]
				)
			).rows[0].count
		: 0;
	return { user: locals.user, cartCount: count, secure: secure() };
}
