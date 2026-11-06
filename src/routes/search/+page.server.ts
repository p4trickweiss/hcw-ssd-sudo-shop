import { query, secure } from '#lib/server/db.ts';
export async function load({ url }: import('./$types').PageServerLoadEvent) {
	const q = (url.searchParams.get('q') ?? '').slice(0, 4000);
	return {
		q,
		secure: secure(),
		products: (
			await query(
				'SELECT id,name,description,price,color,category,is_flag FROM products WHERE name ILIKE $1 ORDER BY id',
				['%' + q + '%']
			)
		).rows
	};
}
