<script lang="ts" context="module">
    export type ToastData = {
        title: string
        description: string
        type: "info" | "success" | "error" | "warning"
    }
   
    const {
        elements: { content, title, description, close },
        helpers,
        states: { toasts },
        actions: { portal }
    } = createToaster<ToastData>()
   
    export const showToast = helpers.addToast
</script>
   
<script lang="ts">
    import { createToaster, melt } from '@melt-ui/svelte'
    import { flip } from 'svelte/animate'
    import { fly } from 'svelte/transition'

    const GetIcon = function(data: ToastData): string {
        switch (data.type) {
            case 'info':
                return `<i class="fa-solid fa-circle-info fa-lg text-info"></i>`
            case 'success':
                return `<i class="fa-solid fa-circle-check fa-lg text-success"></i>`
            case 'error':
                return `<i class="fa-solid fa-circle-exclamation fa-lg text-error"></i>`
            case 'warning':
                return `<i class="fa-solid fa-triangle-exclamation fa-lg text-warning"></i>`
        }
    }
</script>
   
<div class="toast-container" use:portal>
    {#each $toasts as { id, data } (id)}
        <div 
            class="toast"
            use:melt={$content(id)}
            animate:flip={{ duration: 500 }}
            in:fly={{ duration: 300, x: '100%' }}
            out:fly={{ duration: 300, x: '100%' }}
        >
            <div class="toast__content">
                {@html GetIcon(data)}
                <div>
                    <p class="font-bold" use:melt={$title(id)}>
                        {data.title}
                    </p>
                    <p class="text-sm" use:melt={$description(id)}>
                        {data.description}
                    </p>
                </div>
                <button 
                    class="absolute right-2 top-2 grid size-6 place-items-center rounded-full text-primary hover:bg-primary-900/50" 
                    use:melt={$close(id)} aria-label="close notification"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
    {/each}
</div>

<style lang="postcss">
    .toast-container {
        @apply fixed top-0 right-0 z-[var(--toast-z-index)] m-4 flex flex-col items-end gap-2 md:bottom-0 md:top-auto;
    }

    .toast {
        @apply rounded-box bg-base-100 shadow-md;

        & > &__content {
            @apply p-4 relative flex items-center justify-between gap-4 max-w-sm;
        }
    }
</style>