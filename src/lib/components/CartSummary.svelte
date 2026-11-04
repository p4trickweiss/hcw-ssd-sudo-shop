<script lang="ts">
	import { euro } from '#lib/format.ts';
	let {
		subtotal,
		total,
		coupons = []
	}: { subtotal: number; total: number; coupons?: { code: string; amount: number }[] } = $props();
</script>

<div class="summary-lines">
	<p><span>Zwischensumme</span><strong>{euro(subtotal)}</strong></p>
	{#each coupons as coupon}<p class="discount">
			<span>{coupon.code} · 20 %</span><span>− {euro(coupon.amount)}</span>
		</p>{/each}
	<p><span>Versand</span><span>Kostenlos</span></p>
	<hr />
	<p class="total"><span>Gesamt</span><strong>{euro(total)}</strong></p>
</div>
