<script lang="ts">
	import Figure from './Figure.svelte';
	import { euro } from '#lib/format.ts';
	let {
		products
	}: { products: { id: number; name: string; price: number; color: string; category: string }[] } =
		$props();
</script>

<div class="product-grid">
	{#each products as p}
		<a class="product-card" href="/products/{p.id}">
			<div class="product-art">
				<Figure color={p.color} /><span class="art-label">{p.category}</span>
			</div>
			<div class="product-info">
				<span class="eyebrow">SUDO COLLECTION · #{String(p.id).padStart(3, '0')}</span>
				<div class="product-title">
					<h3>{p.name}</h3>
					<span>↗</span>
				</div>
				<p>{euro(p.price)}</p>
			</div>
		</a>
	{/each}
</div>
