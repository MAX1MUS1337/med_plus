<script lang="ts">
    export let palette: "" | "primary" | "neutral" | "info" | "success" | "warning" | "error" = ""
    export let className: string = ""
</script>

<span class={"loading" + (palette ? ` ${palette}` : "") + (className ? ` ${className}` : "")}>
</span>

<style lang="postcss">
    .loading {
        @apply inline-block aspect-square pointer-events-none bg-current w-20;

        &.primary {
            @apply text-primary;
        }
        &.neutral {
            @apply text-neutral;
        }
        &.info {
            @apply text-info;
        }
        &.success {
            @apply text-success;
        }
        &.warning {
            @apply text-warning;
        }
        &.error {
            @apply text-error;
        }

        -webkit-mask-size: 100%;
        mask-size: 100%;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-position: center;
        mask-position: center;

        -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyBzdHlsZT0nc2hhcGUtcmVuZGVyaW5nOiBhdXRvOycgd2lkdGg9JzIwMHB4JyBoZWlnaHQ9JzIwMHB4JyB2aWV3Qm94PScwIDAgMTAwIDEwMCcgcHJlc2VydmVBc3BlY3RSYXRpbz0neE1pZFlNaWQnPjxwYXRoIGZpbGw9J25vbmUnIHN0cm9rZT0nIzBhMGEwYScgc3Ryb2tlLXdpZHRoPScxMCcgc3Ryb2tlLWRhc2hhcnJheT0nMjA1LjI3MTE0MjU3ODEyNSA1MS4zMTc3ODU2NDQ1MzEyNTYnIGQ9J00yNC4zIDMwQzExLjQgMzAgNSA0My4zIDUgNTBzNi40IDIwIDE5LjMgMjBjMTkuMyAwIDMyLjEtNDAgNTEuNC00MCBDODguNiAzMCA5NSA0My4zIDk1IDUwcy02LjQgMjAtMTkuMyAyMEM1Ni40IDcwIDQzLjYgMzAgMjQuMyAzMHonIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3R5bGU9J3RyYW5zZm9ybTpzY2FsZSgwLjgpO3RyYW5zZm9ybS1vcmlnaW46NTBweCA1MHB4Jz48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdzdHJva2UtZGFzaG9mZnNldCcgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnIGR1cj0nMnMnIGtleVRpbWVzPScwOzEnIHZhbHVlcz0nMDsyNTYuNTg4OTI4MjIyNjU2MjUnPjwvYW5pbWF0ZT48L3BhdGg+PC9zdmc+);
        mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyBzdHlsZT0nc2hhcGUtcmVuZGVyaW5nOiBhdXRvOycgd2lkdGg9JzIwMHB4JyBoZWlnaHQ9JzIwMHB4JyB2aWV3Qm94PScwIDAgMTAwIDEwMCcgcHJlc2VydmVBc3BlY3RSYXRpbz0neE1pZFlNaWQnPjxwYXRoIGZpbGw9J25vbmUnIHN0cm9rZT0nIzBhMGEwYScgc3Ryb2tlLXdpZHRoPScxMCcgc3Ryb2tlLWRhc2hhcnJheT0nMjA1LjI3MTE0MjU3ODEyNSA1MS4zMTc3ODU2NDQ1MzEyNTYnIGQ9J00yNC4zIDMwQzExLjQgMzAgNSA0My4zIDUgNTBzNi40IDIwIDE5LjMgMjBjMTkuMyAwIDMyLjEtNDAgNTEuNC00MCBDODguNiAzMCA5NSA0My4zIDk1IDUwcy02LjQgMjAtMTkuMyAyMEM1Ni40IDcwIDQzLjYgMzAgMjQuMyAzMHonIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3R5bGU9J3RyYW5zZm9ybTpzY2FsZSgwLjgpO3RyYW5zZm9ybS1vcmlnaW46NTBweCA1MHB4Jz48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdzdHJva2UtZGFzaG9mZnNldCcgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnIGR1cj0nMnMnIGtleVRpbWVzPScwOzEnIHZhbHVlcz0nMDsyNTYuNTg4OTI4MjIyNjU2MjUnPjwvYW5pbWF0ZT48L3BhdGg+PC9zdmc+);
    }
</style>