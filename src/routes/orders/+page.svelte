<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.ts';
	import { euro, date } from '#lib/format.ts';
	let { data } = $props();
</script>

<svelte:head><title>Bestellungen · Sudo-Shop</title></svelte:head>
<section class="page-heading">
	<span class="eyebrow">DEINE SAMMLUNG WÄCHST</span>
	<h1>Deine Bestellungen.</h1>
	<p>Alle deine Einkäufe an einem Ort.</p>
</section>
<div class="order-list">
	{#each data.orders as order}<a class="panel order-card" href="/orders/{order.id}"
			><div>
				<span class="eyebrow">BESTELLUNG #{String(order.id).padStart(4, '0')}</span>
				<h3>{date(order.created_at)}</h3>
				<p>
					{order.items
						.map((i: { name: string; quantity: number }) => `${i.quantity} × ${i.name}`)
						.join(' · ')}
				</p>
			</div>
			<div>
				<span class="pill">Abgeschlossen</span>
				<h3>{euro(order.total)} ↗</h3>
			</div></a
		>{:else}<div class="empty">
			<h2>Noch keine Bestellungen</h2>
			<p>Hier beginnt deine kleine Sammlung.</p>
			<Button href="/products">Zur Kollektion</Button>
		</div>{/each}
</div>
