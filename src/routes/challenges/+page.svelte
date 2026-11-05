<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.ts';
	import { Input } from '#lib/components/ui/input/index.ts';
	import Notice from '#lib/components/Notice.svelte';
	import { challenges } from '#lib/challenges.ts';
	let { data, form } = $props();
</script>

<svelte:head><title>Security Playground · Sudo-Shop</title></svelte:head>
<section class="page-heading challenge-heading">
	<span class="eyebrow">SECURITY PLAYGROUND</span>
	<h1>Entdecken. Verstehen. Knacken.</h1>
	<p>Drei kleine Lücken, große Lernmomente. Erkunde die Sicherheit unseres Shops.</p>
	<span class="pill">{data.solves.length} / 3 Challenges gelöst</span>
</section>
<div class="scope-note">
	<strong>Dein Spielfeld: dieser lokale Shop.</strong> Nutze nur die fiktiven Testkonten. Proxmox, WireGuard,
	Infrastruktur und Systeme anderer Gruppen sind keine Challenge-Ziele.
</div>
<Notice {form} />
{#if !data.user}<div class="notice">
		<a href="/login">Melde dich an</a>, um Flags einzureichen und Fortschritt zu speichern.
	</div>{/if}
<div class="challenge-list">
	{#each challenges as c}<section class="panel challenge-card">
			<div class="challenge-number">{c.number}</div>
			<div class="challenge-content">
				<div class="section-title">
					<span class="eyebrow">{c.category}</span><span
						class="pill"
						class:solved={data.solves.includes(c.id)}
						>{data.solves.includes(c.id) ? '✓ Gelöst' : 'Offen'}</span
					>
				</div>
				<h2>{c.title}</h2>
				<p class="challenge-goal">{c.goal}</p>
				<div class="challenge-details">
					<div>
						<h3>Einstieg & Vorbedingungen</h3>
						<p>{c.precondition}</p>
						<a href={c.entry}>{c.entryLabel} ↗</a>
					</div>
					<div>
						<h3>Erfolgskriterium</h3>
						<p>{c.success}</p>
					</div>
				</div>
				<details>
					<summary>Ein kleiner Hinweis</summary>
					<p>{c.hint}</p>
				</details>
				<details>
					<summary>Lernziel & fachliche Zuordnung</summary>
					<p>{c.objective}</p>
					<p><a href={c.source} target="_blank" rel="noreferrer">{c.cwe}: {c.cweName} ↗</a></p>
					<p><a href={c.cve} target="_blank" rel="noreferrer">{c.reference} ↗</a></p>
				</details>
				{#if c.id === 'c2' && data.user?.username === 'alice'}<div class="attack-box">
						<h3>Deine Angriffskennung</h3>
						{#if data.attack}<code class="break-all">{data.attack.token}</code
							>{#if data.attack.leaked_note}<p>
									<strong>Abgefangene fiktive Notiz:</strong>
									{data.attack.leaked_note}
								</p>
								<code class="break-all">{data.attack.flag}</code>{:else}<p>
									Noch keine Notiz eingegangen. Nach der Vorführung mit Bob diese Seite neu laden.
								</p>{/if}{:else}<form method="POST" action="?/attack">
								<Button variant="outline" type="submit">Angriffskennung erstellen</Button>
							</form>{/if}
					</div>{/if}
				{#if data.user}<form method="POST" action="?/submit" class="flag-form">
						<input type="hidden" name="challenge" value={c.id} /><label for="flag-{c.id}"
							>Flag einreichen</label
						>
						<div>
							<Input
								id="flag-{c.id}"
								name="flag"
								placeholder="SUDO&#123;…&#125;"
								required
								maxlength={150}
							/><Button type="submit" variant="outline">Prüfen →</Button>
						</div>
					</form>{/if}
			</div>
		</section>{/each}
</div>
