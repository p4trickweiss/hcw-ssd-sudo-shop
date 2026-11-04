<script lang="ts">
	import { ArrowRight, Package, Sparkles, ShieldCheck } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import Figure from '#lib/components/Figure.svelte';
	import ProductGrid from '#lib/components/ProductGrid.svelte';
	let { data } = $props();
</script>

<section class="hero">
	<div class="hero-copy">
		<span class="pill"><span class="status-dot"></span> DEIN NÄCHSTES LIEBLINGSSTÜCK</span>
		<h1>Kleine Figuren.<br />Große <span>Freude.</span></h1>
		<p>
			Entdecke unsere bunte Welt der Labubus. Von kleinen Überraschungen bis zu besonderen
			Sammlerstücken.
		</p>
		<Button href="/products" size="lg">Kollektion entdecken <ArrowRight size={17} /></Button>
		<div class="hero-note"><span>✦</span> Für Sammler. Für Neugierige. Für dich.</div>
	</div>
	<div class="hero-art">
		<span class="orbit orbit-one"></span><span class="orbit orbit-two"></span>
		<div class="hero-figure"><Figure color="cream" /></div>
		<span class="floating-note">Meet your new<br /><strong>little companion.</strong> ♡</span><span
			class="hero-edition">THE CLOUD EDITION / 001</span
		>
	</div>
</section>
<div class="benefits">
	<span><Package size={18} /> Fiktive Produkte, große Auswahl</span><span
		><Sparkles size={18} /> Mit Liebe zum Detail</span
	><span><ShieldCheck size={18} /> Sicher lernen & ausprobieren</span>
</div>
<section class="section">
	<div class="section-title">
		<div>
			<span class="eyebrow">KLEINE PERSÖNLICHKEITEN</span>
			<h2>Finde deinen Favoriten.</h2>
		</div>
		<a href="/products">Zur ganzen Kollektion <ArrowRight size={16} /></a>
	</div>
	<ProductGrid products={data.products} />
</section>
<section class="challenge-banner">
	<div class="code-mark">&lt;/&gt;</div>
	<div>
		<span class="eyebrow">MEHR ALS EIN SHOP</span>
		<h2>Neugierig, was dahintersteckt?</h2>
		<p>Drei Challenges. Drei Sicherheitslücken. Lerne Websicherheit direkt am Shop.</p>
	</div>
	<Button href="/challenges" variant="outline">Challenges entdecken <ArrowRight size={16} /></Button
	>
</section>
