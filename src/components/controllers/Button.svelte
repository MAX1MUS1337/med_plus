<script lang="ts">
    let root: HTMLButtonElement

    let btnStyles: string = ""
    const ComputeStyles = function() {
        let styles: Record<string, any> = {}

        if (modifiers.tranparent) styles["background-color"] = "transparent"
        if (modifiers.flat) styles["border-radius"] = "0px"

        if (modifiers.fixedSize) {
            styles["width"] = `${modifiers.fixedSize}px`
            styles["height"] = `${modifiers.fixedSize}px`
        }

        if (modifiers.circle) {
            styles["border-radius"] = "9999px"
            styles["width"] = `${modifiers.circle}px`
            styles["height"] = `${modifiers.circle}px`
        }

        if (modifiers.square) {
            styles["border-radius"] = "0px"
            styles["width"] = `${modifiers.square}px`
            styles["height"] = `${modifiers.square}px`
        }

        btnStyles = Object.entries(styles).map(v => `${v[0]}: ${v[1]}`).join(";")
    }

    export let className: string = ""
    export let palette: "" | "primary" | "neutral" | "info" | "success" | "warning" | "error" = ""
    export let type: "button" | "submit" | "reset" = "button"
    export let disableAnimation: boolean = false
    export let disabled: boolean = false

    export let modifiers: {
        tranparent?: boolean,
        fixedSize?: number,
        flat?: boolean,
        circle?: number,
        square?: number,
    } = {}
    $: modifiers, ComputeStyles()

    export let onClick: () => any = () => {}
</script>

<button 
    type={type} 
    class={"btn" + (className ? ` ${className}` : "") + (palette ? ` ${palette}` : "")} 
    class:disableAnimation={disableAnimation}
    style={btnStyles}
    disabled={disabled}
    on:click={onClick}
    bind:this={root}
>
    <slot />
</button>

<style lang="postcss">
    .btn {
        @apply px-3 py-2 rounded-btn !outline-none hover:bg-black/10
        flex flex-row flex-wrap items-center justify-center gap-2
        active:scale-90 transition-all duration-[var(--animation-btn)];

        &:disabled {
            @apply !bg-neutral/20 !text-base-content/20;
        }

        &.disableAnimation {
            @apply no-animation active:scale-100;
        }

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