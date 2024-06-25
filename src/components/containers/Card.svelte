<script lang="ts">
    export let className: string = ""
    export let styles: string = ""
    export let partStyling: {
        side?: {
            class?: string,
            style?: Record<string, any>,
        },
        header?: {
            class?: string,
            style?: Record<string, any>,
        }, 
        body?: {
            class?: string,
            style?: Record<string, any>,
        }, 
        footer?: {
            class?: string,
            style?: Record<string, any>,
        }
    } = {}
</script>

<div class={"card" + (className ? ` ${className}` : ``)} style={styles}>
    <div 
        class={"side" + (partStyling.side?.class ? ` ${partStyling.side?.class}` : "")}
        style={Object.entries(partStyling.side?.style ?? {}).map(v => `${v[0]}: ${v[1]}`).join(";")}
    >
        <slot name="side" />
    </div>
    <div class="flex flex-col justify-between w-full">
        <div 
            class={"header" + (partStyling.header?.class ? ` ${partStyling.header?.class}` : "")}
            style={Object.entries(partStyling.header?.style ?? {}).map(v => `${v[0]}: ${v[1]}`).join(";")}
        >
            <slot name="header" />
        </div>
        <div 
            class={"body" + (partStyling.body?.class ? ` ${partStyling.body?.class}` : "")} 
            style={Object.entries(partStyling.body?.style ?? {}).map(v => `${v[0]}: ${v[1]}`).join(";")}
        >
            <slot name="body" />
        </div>
        <div 
            class={"footer" + (partStyling.footer?.class ? ` ${partStyling.footer?.class}` : "")}
            style={Object.entries(partStyling.footer?.style ?? {}).map(v => `${v[0]}: ${v[1]}`).join(";")}
        >
            <slot name="footer" />
        </div>
    </div>
</div>

<style lang="postcss">
    .card {
        @apply relative rounded-box shadow-xl bg-base-100 flex flex-row p-3 gap-3;

        & > .side {
            @apply relative overflow-hidden empty:hidden; 
        }

        & > div > .header {
            @apply flex flex-col gap-3;
        }

        & > div > .body {
            @apply flex flex-col gap-2;
        }

        & > div > .footer {
            @apply flex flex-row justify-end gap-3;
        }
    }
</style>