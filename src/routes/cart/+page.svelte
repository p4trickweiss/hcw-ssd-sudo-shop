<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.ts';
	import { Input } from '#lib/components/ui/input/index.ts';
	import Figure from '#lib/components/Figure.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import CartSummary from '#lib/components/CartSummary.svelte';
	import { euro } from '#lib/format.ts';
	let { data, form } = $props();
</script>

<svelte:head><title>Warenkorb · Sudo-Shop</title></svelte:head>
<section class="page-heading">
	<span class="eyebrow">DEINE AUSWAHL</span>
	<h1>Ein Korb voller Freude.</h1>
	<p>Fast bereit für deine neue Sammlung.</p>
</section>
<Notice {form} />
{#if !data.items.length}<div class="empty">
		<span>♧</span>
		<h2>Dein Warenkorb ist leer</h2>
		<p>Dein nächstes Lieblingsstück wartet schon auf dich.</p>
		<Button href="/products">Kollektion entdecken →</Button>
	</div>{:else}
	<div class="checkout-grid">
		<div>
			<div class="cart-items">
				{#each data.items as p}<article class="cart-item">
						<a href="/products/{p.id}"><Figure color={p.color} small /></a>
						<div class="cart-item-info">
							<a href="/products/{p.id}"><h3>{p.name}</h3></a>
							<p>{euro(p.price)} / Stück</p>
							<form method="POST" action="?/remove">
								<input type="hidden" name="product_id" value={p.id} /><button class="text-button"
									>Entfernen</button
								>
							</form>
						</div>
						<form method="POST" action="?/update" class="quantity-form">
							<input type="hidden" name="product_id" value={p.id} /><label
								for="qty-{p.id}"
								class="eyebrow">Menge</label
							><Input
								id="qty-{p.id}"
								type="number"
								name="quantity"
								value={p.quantity}
								min="1"
								max="99"
								step="1"
								required
							/><button class="text-button">Ändern</button>
						</form>
						<strong class="line-price">{euro(p.price * p.quantity)}</strong>
					</article>{/each}
			</div>
			<a href="/products" class="back-link">← Weiter einkaufen</a>
		</div>
		<aside class="panel summary">
			<h2>Dein Überblick</h2>
			<CartSummary {...data} /><Button href="/checkout" class="w-full" size="lg">Zur Kasse →</Button
			>
			<hr />
			<h3>Ein kleiner Vorteil für dich</h3>
			<p class="fine-print">
				20 % mit <strong>LABUBU20</strong>. Einmal pro Bestellung vorgesehen.
			</p>
			<form method="POST" action="?/coupon" class="coupon-form">
				<Input name="code" placeholder="Gutscheincode" required maxlength={40} /><Button
					type="submit"
					variant="outline">Einlösen</Button
				>
			</form>
			{#if data.coupons.length}<form method="POST" action="?/clearCoupons">
					<button class="text-button">Alle Gutscheine entfernen</button>
				</form>{/if}
		</aside>
	</div>{/if}
