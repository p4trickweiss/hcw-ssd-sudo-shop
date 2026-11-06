<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.ts';
	import Notice from '#lib/components/Notice.svelte';
	import CartSummary from '#lib/components/CartSummary.svelte';
	import { euro } from '#lib/format.ts';
	let { data, form } = $props();
</script>

<svelte:head><title>Kasse · Sudo-Shop</title></svelte:head>
<a href="/cart" class="back-link">← Zurück zum Warenkorb</a>
<section class="page-heading">
	<span class="eyebrow">DER LETZTE SCHRITT</span>
	<h1>Bereit für dein Lieblingsstück?</h1>
	<p>Prüfe deine Artikel und den Gesamtbetrag.</p>
</section>
<Notice {form} />
<div class="checkout-grid">
	<section class="panel">
		<h2>Deine Bestellübersicht</h2>
		{#each data.items as p}<div class="order-line">
				<div>
					<strong>{p.name}</strong>
					<p>{p.quantity} × {euro(p.price)}</p>
				</div>
				<strong>{euro(p.price * p.quantity)}</strong>
			</div>{:else}<p>Dein Warenkorb ist leer.</p>
			<a href="/products">Zum Katalog →</a>{/each}
		<div class="simulation-note">
			<strong>Hinweis zur Bestellung</strong>
			<p>
				Die Bestellung wird lokal gespeichert. Es wird kein Geld abgebucht und nichts versendet.
			</p>
		</div>
	</section>
	<aside class="panel summary">
		<h2>Zusammenfassung</h2>
		<CartSummary {...data} />
		<p class="fine-print">Dein Guthaben: {euro(data.user?.balance ?? 0)}</p>
		<form method="POST">
			<Button type="submit" size="lg" class="w-full" disabled={!data.items.length}
				>Bestellung simulieren →</Button
			>
		</form>
	</aside>
</div>
