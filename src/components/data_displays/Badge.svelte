<script lang="ts">
    export let className: string = ""
    export let palette: "" | "primary" | "neutral" | "info" | "success" | "warning" | "error" = ""
</script>

<div class={"badge" + (className ? ` ${className}` : "") + (palette ? ` ${palette}` : "")} >
    <slot />
</div>

<style lang="postcss">
    .badge {
        @apply px-2 text-sm rounded-box !outline-none bg-base-200 text-base-content
        flex flex-row flex-wrap items-center justify-center gap-2;

        &.primary {
            @apply bg-primary text-primary-content;
        }
        &.neutral {
            @apply bg-neutral text-neutral-content;
        }
        &.info {
            @apply bg-info text-info-content;
        }
        &.success {
            @apply bg-success text-success-content;
        }
        &.warning {
            @apply bg-warning text-warning-content;
        }
        &.error {
            @apply bg-error text-error-content;
        }
    }
</style>