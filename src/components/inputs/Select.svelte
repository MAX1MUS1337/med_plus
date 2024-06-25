<script lang="ts">
    import { createPopover, melt } from '@melt-ui/svelte'

    import { fade, scale } from "svelte/transition"

    const {
        elements: { trigger, content},
        states: { open },
    } = createPopover({
        forceVisible: true,
        positioning: {
            placement: "bottom-start",
            sameWidth: true,
            overflowPadding: 0,
        }
    })

    $: valueType = options.length > 0 ? (typeof options[0]) : undefined

    let valueLabel: any = null
    const SetValue = function(option: any | Record<string, any>) {
        if (valueType == "object") {
            value = option[valueKey]
            valueLabel = option[labelKey]
        } else {
            value = option
            valueLabel = option
        }

        open.set(false)
    }
    const UpdateValueLabel = function(val: any) {
        if (valueType == "object" && val != null) {
            valueLabel = options.find(v => v[valueKey] == val)[labelKey]
        } else {
            valueLabel = val
        }
    }
    $: UpdateValueLabel(value)

    export let name: string

    export let value: any = null
    export let options: any[] | Record<string, any>[] = []
    export let valueKey: string = "value"
    export let labelKey: string = "label"
    export let className: string = ""
    export let label: string = ""
    export let required: boolean = false
    export let placeholder: string = "Выберите вариант"
    export let icon: string = ""
    export let error: string | null = null
</script>

<div class={"select" + (className ? ` ${className}` : "")} class:required={required}>
    {#if label != ""}
        <label for={name}>{label}</label>
    {/if}

    <button class="select__container" use:melt={$trigger}>
        {#if icon}
            <div class="icon">
                <span class={icon}></span>
            </div>
        {/if}
        <div class="select__value">
            {valueLabel ? valueLabel : placeholder}
        </div>
        <span class="select__trigger text-primary">
            <i class="fa-solid fa-caret-down transition-transform" class:rotate-180={$open}></i>
        </span>
    </button>

    {#if $open}
        <div
            use:melt={$content}
            transition:scale={{ duration: 300 }}
            class="select__dropdown"
        >
            {#each options as option, idx (idx)}
                <button class="option" on:click={() => SetValue(option)}>{valueType == "object" ? option[labelKey] : option}</button>
            {/each}
        </div>
    {/if}

    {#if error}
        <p class="text-error" transition:fade>{error}</p>
    {/if}
</div>

<style lang="postcss">
    .select {
        @apply flex flex-col gap-2 w-[95%];

        &.required label {
            @apply after:content-['*'] after:ml-1 after:text-error;
        }

        & > &__container {
            @apply flex items-stretch border-2 rounded-input bg-base-100 border-base-300 overflow-hidden focus:outline-primary;

            & > .icon{
                @apply bg-base-300 flex items-center justify-center min-w-12 max-w-12;
            }
        }

        &__value {
            @apply flex flex-row items-center gap-3 flex-wrap w-full p-3;
        }

        &__trigger {
            @apply p-3;
        }

        &__dropdown {
            @apply z-10 w-max max-w-[80vw] flex flex-col rounded-box bg-base-100 overflow-x-hidden overflow-y-auto shadow-lg;

            & > .option {
                @apply px-2 py-3 text-left
                hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none;
            }
        }
    }
</style>