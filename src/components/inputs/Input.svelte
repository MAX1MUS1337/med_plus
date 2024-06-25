<script lang="ts">
    import Button from "$components/controllers/Button.svelte"

    import { fade } from "svelte/transition"
    
    let showPassword: boolean = false

    export let name: string

    export let value: string = ""

    export let className: string = ""
    export let label: string = ""
    export let labelInner: boolean = false
    export let required: boolean = false
    export let placeholder: string = ""
    export let icon: string = ""
    export let type: "text" | "number" | "password" | "email" | "phone" | "time" = "text"
    export let error: string | null = null
</script>

<div class={"input" + (className ? ` ${className}` : "")} class:required={required}>
    {#if !labelInner && label != ""}
        <label for={name}>{label}</label>
    {/if}

    <div class="input__container">
        {#if labelInner && label != ""}
            <label class="inner" for={name}>{label}</label>
        {/if}

        {#if icon}
            <div class="icon">
                <span class={icon}></span>
            </div>
        {/if}

        <input class={labelInner ? "flex-1" : ""} {...{
            "type": type,
            "id": name,
            "name": name,
            "placeholder": placeholder,
            "required": required,
        }} bind:value={value}>

        {#if type == "password" && value != "" || showPassword}
            <Button className="!rounded-none !bg-transparent !text-primary" onClick={() => {
                showPassword = !showPassword

                type = showPassword ? "text" : "password"
            }}>
                {#if showPassword}
                    <i class="fa-solid fa-eye-slash"></i>
                {:else}
                    <i class="fa-solid fa-eye"></i>
                {/if}
            </Button>
        {/if}
    </div>

    {#if error}
        <p class="text-error" transition:fade>{error}</p>
    {/if}
</div>

<style lang="postcss">
    .input {
        @apply flex flex-col gap-2 w-[95%];

        & label.inner {
            @apply bg-base-100 max-w-full font-semibold flex items-center p-2;
        }

        &.required label {
            @apply after:content-['*'] after:ml-1 after:text-error;
        }

        & > &__container {
            @apply flex items-stretch border-2 rounded-input border-base-300 overflow-hidden;

            & > .icon{
                @apply bg-base-300 flex items-center justify-center min-w-12 max-w-12;
            }

            & > input {
                @apply p-3 !outline-none w-full;
            }
        }
    }
</style>