<script lang="ts">
	import { generateForegroundColorFrom, stringToColor } from "$lib/colors"

    const TitleToInitials = function(title: string): string {
        const tokens = title.split(" ")

        if (tokens.length >= 2) return `${tokens[0][0].toUpperCase()}${tokens[1][0].toUpperCase()}`

        if (tokens.length == 1) return tokens[0].slice(0, 2).toUpperCase()

        return ""
    }

    $: background = stringToColor(title)
    $: foreground = `rgb(${generateForegroundColorFrom(background)})`

    export let title: string
    export let className: string = ""
</script>

<div class={"avatar" + (className ? ` ${className}` : "")} style={`background-color: ${background}; color: ${foreground}`}>
    <span>{TitleToInitials(title)}</span>
</div>

<style lang="postcss">
    .avatar {
        --avatar-size: 40px;

        @apply w-[var(--avatar-size)] h-[var(--avatar-size)] rounded-full overflow-hidden flex items-center justify-center bg-primary text-primary-content select-none;
    }
</style>