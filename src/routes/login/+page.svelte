<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.ts';
	import { Input } from '#lib/components/ui/input/index.ts';
	import Notice from '#lib/components/Notice.svelte';
	let { form } = $props();
</script>

<svelte:head><title>Anmelden · Sudo-Shop</title></svelte:head>
<div class="auth-wrap">
	<section class="panel auth-panel">
		<span class="eyebrow">WILLKOMMEN ZURÜCK</span>
		<h1>Deine Sammlung wartet.</h1>
		<p>Melde dich mit einem fiktiven Testkonto an.</p>
		<Notice {form} />
		<form method="POST" class="stack">
			<label for="username">Benutzername</label><Input
				id="username"
				name="username"
				autocomplete="username"
				required
				placeholder="alice oder bob"
			/><label for="password">Passwort</label><Input
				id="password"
				name="password"
				type="password"
				autocomplete="current-password"
				required
			/><Button type="submit">Anmelden →</Button>
		</form>
		<div class="test-accounts">
			<strong>Testkonten für die Demo</strong>
			<p><code>alice</code> · Guthaben 100,00 €<br /><code>bob</code> · Guthaben 20,00 €</p>
			<p>Passwort jeweils: <code>labubu123</code></p>
		</div>
	</section>
</div>
