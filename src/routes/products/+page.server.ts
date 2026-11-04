import { query } from '#lib/server/db.ts';
export async function load() {
	return {
		products: (
			await query(
				'SELECT id,name,description,price,color,category,is_flag FROM products ORDER BY id'
			)
		).rows
	};
}
