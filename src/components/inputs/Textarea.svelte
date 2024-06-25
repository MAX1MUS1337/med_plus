<script lang="ts">
    import { fade } from "svelte/transition"

    export let name: string

    export let value: string = ""

    export let className: string = ""
    export let label: string = ""
    export let required: boolean = false
    export let placeholder: string = ""
    export let error: string | null = null
</script>

<div class={"textarea" + (className ? ` ${className}` : "")} class:required={required}>
    {#if label != ""}
        <label for={name}>{label}</label>
    {/if}

    <div class="textarea__container">
        <textarea rows="3" name={name} id={name} placeholder={placeholder} required={required} bind:value={value}></textarea>
    </div>

    {#if error}
        <p class="text-error" transition:fade>{error}</p>
    {/if}
</div>

<style lang="postcss">
    .textarea {
        @apply flex flex-col gap-2 w-[95%];

        &.required label {
            @apply after:content-['*'] after:ml-1 after:text-error;
        }

        & > &__container {
            @apply flex items-stretch border-2 rounded-input border-base-300 overflow-hidden;

            & > textarea {
                @apply p-3 !outline-none w-full;
            }
        }
    }
</style>