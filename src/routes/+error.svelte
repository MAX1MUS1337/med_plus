<script lang="ts">
	import { page } from '$app/stores'

	import NotFound from '$components/screens/NotFound.svelte'
</script>

<svelte:head>
    <title>Панель управления</title>
</svelte:head>

{#if $page.status == 404}
    <NotFound />
{/if}