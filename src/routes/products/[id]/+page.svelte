<script lang="ts">
	import Figure from '#lib/components/Figure.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import { euro } from '#lib/format.ts';
	import { ShoppingBag, Package } from '@lucide/svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>{data.product.name} · Sudo-Shop</title></svelte:head>
<a class="back-link" href="/products">← Zurück zum Katalog</a>
<div class="detail-grid">
	<div class="detail-art"><Figure color={data.product.color} /></div>
	<section class="detail-copy">
		<span class="eyebrow"
			>{data.product.category} · PRODUKT #{String(data.product.id).padStart(3, '0')}</span
		>
		<h1>{data.product.name}</h1>
		<p class="detail-price">{euro(data.product.price)}</p>
		<p>{data.product.description}</p>
		<Notice {form} />
		<form method="POST">
			<Button type="submit" size="lg"><ShoppingBag size={18} /> In den Warenkorb</Button>
		</form>
		<div class="detail-meta">
			<Package size={18} /><span>Teil der Sudo Collection<br />Für deine Sammlung</span>
		</div>
	</section>
</div>
