<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '#lib/components/ui/button/index.ts';
</script>

<svelte:head><title>{page.status} · Sudo-Shop</title></svelte:head>
<div class="empty">
	<span>{page.status}</span>
	<h1>{page.error?.message ?? 'Diese Seite ist nicht verfügbar.'}</h1>
	<p>Gehe zurück zur Kollektion und entdecke unsere Figuren.</p>
	<Button href="/products">Zum Katalog →</Button>
</div>
