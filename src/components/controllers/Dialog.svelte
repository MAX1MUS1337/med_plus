<script lang="ts">
    import { createDialog, melt } from '@melt-ui/svelte'
    import { fade, scale } from 'svelte/transition'

	import Button from '$components/controllers/Button.svelte'
  
    export let title: string = ""
    export let disableClose: boolean = false

    const {
        elements: {
            overlay,
            content,
            title: m_title,
            close,
            portalled,
        },
        states: { open },
    } = createDialog({
        forceVisible: true,
        closeOnOutsideClick: !disableClose,
        closeOnEscape: !disableClose,
    })

    export const Open = function() {
        open.set(true)
    }

    export const Close = function() {
        open.set(false)
    }
</script>
  
{#if $open}
    <div class="" use:melt={$portalled}>
        <div
            use:melt={$overlay}
            class="dialog"
            transition:fade={{ duration: 150 }}
        />
        <div
            class="dialog__content"
            use:melt={$content}
            transition:scale
        >
            <p use:melt={$m_title} class="dialog__content__header">
                <slot name="header">
                    <p class="dialog__content__title">{title}</p>
                </slot>
            </p>

            <div class="dialog__content__body">
                <slot name="body"/>
            </div>

            <div class="dialog__content__footer">
                <slot name="footer"/>
            </div>

            {#if !disableClose}
                <div use:melt={$close}>
                    <Button className="!bg-neutral !text-neutral-content absolute right-4 top-4" modifiers={{circle: 40}}><i class="fa-solid fa-xmark"></i></Button>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style lang="postcss">
    .dialog {
        @apply fixed inset-0 z-[var(--dialog-z-index)] bg-black/40 backdrop-blur-sm;

        &__content {
            @apply fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[var(--dialog-z-index)] 
            w-[95%] max-w-[450px]
            rounded-box bg-base-100 p-6 shadow-lg;

            &__title {
                @apply text-2xl font-bold;
            }

            &__body {
                @apply flex flex-col gap-3 my-3 max-h-[75vh] overflow-auto;
            }

            &__header, &__footer{
                @apply flex items-center flex-wrap gap-3;
            }
        }
    }
</style>