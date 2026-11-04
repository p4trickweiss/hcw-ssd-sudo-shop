<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.ts';
	import { euro, date } from '#lib/format.ts';
	let { data } = $props();
</script>

<svelte:head><title>Bestellung #{data.order.id} · Sudo-Shop</title></svelte:head>
<a href="/orders" class="back-link">← Zu deinen Bestellungen</a>
<section class="page-heading">
	<span class="eyebrow">BESTELLUNG GESPEICHERT</span>
	<h1>Ein kleines Stück Freude.</h1>
	<p>Bestellung #{String(data.order.id).padStart(4, '0')} · {date(data.order.created_at)}</p>
</section>
<section class="panel receipt">
	<div class="section-title">
		<h2>Deine Bestelldetails</h2>
		<span class="pill">Abgeschlossen</span>
	</div>
	{#each data.items as p}<div class="order-line">
			<div>
				<strong>{p.name}</strong>
				<p>{p.quantity} × {euro(p.price)}</p>
			</div>
			<strong>{euro(p.price * p.quantity)}</strong>
		</div>{/each}
	<div class="summary-lines">
		<p><span>Zwischensumme</span><strong>{euro(data.order.subtotal)}</strong></p>
		{#each data.discounts as d}<p class="discount">
				<span>{d.code}</span><span>− {euro(d.amount)}</span>
			</p>{/each}
		<hr />
		<p class="total"><span>Gesamt</span><strong>{euro(data.order.total)}</strong></p>
	</div>
	{#if data.order.note}<div class="simulation-note">
			<strong>Bestellnotiz</strong>
			<p class="break-all">{data.order.note}</p>
		</div>{/if}<Button href="/products">Weiter einkaufen →</Button>
</section>
