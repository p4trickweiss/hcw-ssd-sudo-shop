import { error } from '@sveltejs/kit';
import { query, secure } from '#lib/server/db.ts';
import { requireUser } from '#lib/server/auth.ts';
export async function load({ locals, params }: import('./$types').PageServerLoadEvent) {
	const user = requireUser(locals);
	const id = Number(params.id);
	if (!Number.isSafeInteger(id) || id < 1) error(404, 'Bestellung nicht gefunden');
	// C1: Im verwundbaren Modus wird nur die Anmeldung, nicht der Besitzer geprüft.
	const order = (
		await query(
			secure()
				? 'SELECT * FROM orders WHERE id=$1 AND user_id=$2'
				: 'SELECT * FROM orders WHERE id=$1',
			secure() ? [id, user.id] : [id]
		)
	).rows[0];
	if (!order) error(404, 'Bestellung nicht gefunden');
	return {
		order,
		items: (await query('SELECT * FROM order_items WHERE order_id=$1 ORDER BY id', [id])).rows,
		discounts: (await query('SELECT * FROM order_discounts WHERE order_id=$1 ORDER BY id', [id]))
			.rows
	};
}
