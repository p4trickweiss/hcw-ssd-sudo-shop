import { query } from '#lib/server/db.ts';
import { requireUser } from '#lib/server/auth.ts';
export async function load({ locals }: import('./$types').PageServerLoadEvent) {
	return {
		orders: (
			await query(
				`SELECT o.*, COALESCE((SELECT json_agg(i ORDER BY i.id) FROM order_items i WHERE i.order_id=o.id),'[]') AS items FROM orders o WHERE user_id=$1 ORDER BY id DESC`,
				[requireUser(locals).id]
			)
		).rows
	};
}
