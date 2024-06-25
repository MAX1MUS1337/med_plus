<script lang="ts">
    import { createPopover, melt } from '@melt-ui/svelte'
    import { fade } from 'svelte/transition'
  
    const {
        elements: { trigger, content },
        states: { open },
    } = createPopover({
        forceVisible: true,
    })

    export let className: string = ""
</script>

<div use:melt={$trigger}>
    <slot name="trigger"/>
</div>

{#if $open}
    <div
        use:melt={$content}
        transition:fade={{ duration: 100 }}
        class={"dropdown" + (className ? ` ${className}` : "")}
    >
        <div class="flex flex-col">
            <slot name="content"/>
        </div>
    </div>
{/if}
  
<style lang="postcss">
    .dropdown {
        @apply z-10 w-max max-w-sm rounded-box bg-base-100 shadow-md p-3 overflow-hidden;
    }
</style>