<script lang="ts">
	import ProductGrid from '#lib/components/ProductGrid.svelte';
	import { Input } from '#lib/components/ui/input/index.ts';
	import { Button } from '#lib/components/ui/button/index.ts';
	let { data } = $props();
</script>

<svelte:head><title>Suche · Sudo-Shop</title></svelte:head>
<section class="page-heading">
	<span class="eyebrow">AUF ENTDECKUNGSTOUR</span>
	<h1>Finde dein Lieblingsstück.</h1>
</section>
<form action="/search" class="search-large">
	<Input name="q" value={data.q} placeholder="Produkte suchen …" maxlength={4000} /><Button
		type="submit">Suchen</Button
	>
</form>
<!-- C2: Nur diese Ausgabe ist im Challenge-Modus absichtlich nicht kodiert. -->
<div class="search-result">
	Suchergebnisse für: {#if data.secure}{data.q}{:else}{@html data.q}{/if}
</div>
{#if data.products.length}<ProductGrid products={data.products} />{:else}<div class="empty">
		<h2>Keine Figuren gefunden</h2>
		<p>Versuche einen anderen Suchbegriff.</p>
		<a href="/products">Zur ganzen Kollektion →</a>
	</div>{/if}
