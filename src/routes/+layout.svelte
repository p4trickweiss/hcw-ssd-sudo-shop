<script lang="ts">
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import { page, navigating } from '$app/state';
	import { ShoppingBag, Terminal, ArrowUpRight, LogOut } from '@lucide/svelte';
	import { euro } from '#lib/format.ts';
	let { children, data } = $props();
</script>

<svelte:head
	><link rel="icon" href={favicon} /><title>Sudo-Shop · Kleine Figuren. Große Freude.</title><meta
		name="description"
		content="Fiktiver Labubu-Shop und Lernplattform für Websicherheit."
	/></svelte:head
>
<div class="topline">Kleine Figuren. Große Freude.</div>
<header>
	<div class="nav-wrap">
		<a class="brand" href="/">
			<span class="brand-icon"><Terminal size={21} /></span>sudo<span class="brand-light">shop</span
			><span class="brand-dot">.</span></a
		>
		<nav aria-label="Hauptnavigation">
			<a
				class:active={page.url.pathname === '/' || page.url.pathname.startsWith('/products')}
				href="/products">Kollektion</a
			>

			{#if data.user}<a class:active={page.url.pathname.startsWith('/orders')} href="/orders"
					>Bestellungen</a
				>{/if}
			<a class:active={page.url.pathname === '/challenges'} href="/challenges"
				>Challenges <ArrowUpRight size={13} />
			</a>
		</nav>
		<div class="nav-actions">
			{#if data.user}<span class="account"
					><strong>{data.user.username}</strong><small>{euro(data.user.balance)} Guthaben</small
					></span
				>
				<form method="POST" action="/logout">
					<button class="icon-button" title="Abmelden"><LogOut size={18} /></button>
				</form>{:else}<a class="login-link" href="/login">Anmelden</a>{/if}<a
				class="bag"
				href="/cart"
				aria-label="Warenkorb"><ShoppingBag size={20} /><span>{data.cartCount}</span></a
			>
		</div>
	</div>
</header>
{#if navigating.to}<div class="loading-bar" role="status">Wird geladen …</div>{/if}
<main>{@render children()}</main>
<footer>
	<div>
		<a class="brand" href="/">sudo<span class="brand-light">shop</span>.</a>
		<p>Collect a little happiness.</p>
	</div>
	<p>Studienprojekt · Gruppe 4 · HCW<br />Alle Produkte, Daten und Zahlungen sind fiktiv.</p>
	<a href="/challenges">Security Playground ↗</a>
</footer>
<div class="lab-bar">
	<span class="status-dot"></span>Lokale Lernumgebung <span>·</span>
	{data.secure ? 'Sichere Korrekturen aktiv' : 'Challenge-Modus'}
</div>
