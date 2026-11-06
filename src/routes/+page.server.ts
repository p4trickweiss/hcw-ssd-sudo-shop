import { query } from '#lib/server/db.ts';
export async function load() {
	return {
		products: (
			await query(
				'SELECT id,name,description,price,color,category,is_flag FROM products WHERE is_flag=false ORDER BY id LIMIT 3'
			)
		).rows
	};
}
