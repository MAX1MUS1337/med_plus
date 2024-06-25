<script lang="ts">
    import { onMount } from "svelte"

    import "@/app.css"
    import "@/assets/fontawesome/css/all.min.css"

    import Toast from "$components/feedback/Toast.svelte"
    
	import { generateForegroundColorFrom } from "$lib/colors"

    const UpdateTheme = function() {
        const styles = window.getComputedStyle(document.documentElement)

        // neutral
        {
            const neutral = styles.getPropertyValue("--neutral")
            const neutralFg = styles.getPropertyValue("--neutral-fg")

            if (neutralFg == "") document.documentElement.style.setProperty("--neutral-fg", generateForegroundColorFrom(neutral))
        }

        // primary
        {
            const primary = styles.getPropertyValue("--primary")
            const primaryFg = styles.getPropertyValue("--primary-fg")

            if (primaryFg == "") document.documentElement.style.setProperty("--primary-fg", generateForegroundColorFrom(primary))
        }

        // info
        {
            const info = styles.getPropertyValue("--info")
            const infoFg = styles.getPropertyValue("--info-fg")

            if (infoFg == "") document.documentElement.style.setProperty("--info-fg", generateForegroundColorFrom(info))
        }

        // success
        {
            const success = styles.getPropertyValue("--success")
            const successFg = styles.getPropertyValue("--success-fg")

            if (successFg == "") document.documentElement.style.setProperty("--success-fg", generateForegroundColorFrom(success))
        }

        // warning
        {
            const warning = styles.getPropertyValue("--warning")
            const warningFg = styles.getPropertyValue("--warning-fg")

            if (warningFg == "") document.documentElement.style.setProperty("--warning-fg", generateForegroundColorFrom(warning))
        }

        // error
        {
            const error = styles.getPropertyValue("--error")
            const errorFg = styles.getPropertyValue("--error-fg")

            if (errorFg == "") document.documentElement.style.setProperty("--error-fg", generateForegroundColorFrom(error))
        }
    }

    onMount(() => {
        UpdateTheme()
    })
</script>

<Toast />

<slot />