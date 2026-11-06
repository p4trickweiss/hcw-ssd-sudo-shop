<script lang="ts">
	let { form }: { form?: { message?: string; ok?: boolean } | null } = $props();
</script>

{#if form?.message}<div role="status" class:success={form.ok} class="notice">
		{form.message}
	</div>{/if}
