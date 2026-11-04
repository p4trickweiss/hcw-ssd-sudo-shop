<script lang="ts">
	import { onMount } from 'svelte';
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
	import ProductGrid from '#lib/components/ProductGrid.svelte';
	let { data } = $props();
	let category = $state('Alle');
	const categories = ['Alle', 'Einzelfigur', 'Blind Box', 'Sonderedition', 'Mini'];
	let products = $derived(
		category === 'Alle' ? data.products : data.products.filter((p) => p.category === category)
	);
</script>

<svelte:head><title>Kollektion · Sudo-Shop</title></svelte:head>
<section class="page-heading">
	<span class="eyebrow">SUDO COLLECTION</span>
	<h1>Für deine kleine Welt.</h1>
	<p>Entdecke alle Figuren und finde ein neues Lieblingsstück.</p>
</section>
<div class="catalog-tools">
	<div class="tabs">
		{#each categories as c}<button
				disabled={!ready}
				class:selected={category === c}
				onclick={() => (category = c)}>{c}</button
			>{/each}
	</div>
	<form action="/search" class="search-form">
		<input
			aria-label="Produkte suchen"
			name="q"
			placeholder="Dein Lieblingsstück suchen …"
		/><button aria-label="Suchen">⌕</button>
	</form>
</div>
<div class="catalog-count">{products.length} Sammlerstücke</div>
<ProductGrid {products} />
<div class="muted-note">✦ Alle Figuren sind fiktive Produkte dieses Studienprojekts.</div>
