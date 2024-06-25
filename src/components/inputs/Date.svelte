<script lang="ts">
    import { createDatePicker, melt } from '@melt-ui/svelte'
    import { fade } from 'svelte/transition'

    import { parseDate, getLocalTimeZone } from '@internationalized/date'

    import Button from '$components/controllers/Button.svelte'

    export let value = ""
    $: _value.set(value != "" ? parseDate(value) : undefined)
    $: value = $_value?.toString() ?? ""

    export let locale: string = "ru"
    $: _locale.set(locale)

    export let className: string = ""
    export let label: string = ""
    export let required: boolean = false
    export let icon: string = ""
    export let error: string | null = null
  
    const {
        elements: {
            calendar,
            cell,
            content,
            field,
            grid,
            heading,
            label: _label,
            nextButton,
            prevButton,
            segment,
            trigger,
        },
        states: { months, headingValue, weekdays, segmentContents, open, value: _value },
        helpers: { isDateDisabled, isDateUnavailable },
        options: { locale: _locale },
    } = createDatePicker({
        forceVisible: true,
        locale: locale,
    })

    export let unix: number = 0
    const UpdateUnix = function() {
        const _date = $_value?.toDate(getLocalTimeZone())

        if (!_date) return

        unix = Math.floor(_date.getTime() / 1000)
    }
    $: $_value, UpdateUnix()
</script>
  
<div class={"input" + (className ? ` ${className}` : "")} class:required={required}>
    {#if label != ""}
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label use:melt={$_label}>{label}</label>
    {/if}

    <div class="input__container">
        {#if icon}
            <div class="icon">
                <span class={icon}></span>
            </div>
        {/if}

        <div use:melt={$field}>
            {#key $_locale}
                {#each $segmentContents as seg}
                    <div use:melt={$segment(seg.part)}>
                        {seg.value}
                    </div>
                {/each}
            {/key}
            <div>
                <div use:melt={$trigger}>
                    <Button className="hover:!bg-primary/10 focus:!bg-primary/10 text-primary" modifiers={{
                        fixedSize: 35
                    }}>
                        <i class="fa-solid fa-calendar"></i>
                    </Button>
                </div>
            </div>
        </div>
    </div>

    {#if error}
        <p class="text-error" transition:fade>{error}</p>
    {/if}
</div>

{#if $open}
    <div
        transition:fade={{ duration: 300 }}
        use:melt={$content}
    >
        <div use:melt={$calendar}>
            <header>
                <div use:melt={$prevButton}>
                    <Button className="hover:!bg-neutral-content/10 focus:!bg-neutral-content/10" modifiers={{
                        circle: 30
                    }}>
                        <i class="fa-solid fa-chevron-left"></i>
                    </Button>
                </div>
                <div use:melt={$heading}>
                    {$headingValue}
                </div>
                <div use:melt={$nextButton}>
                    <Button className="hover:!bg-neutral-content/10 focus:!bg-neutral-content/10" modifiers={{
                        circle: 30
                    }}>
                        <i class="fa-solid fa-chevron-right"></i>
                    </Button>
                </div>
            </header>
            <div>
                {#each $months as month}
                    <table use:melt={$grid}>
                        <thead aria-hidden="true">
                            <tr>
                                {#each $weekdays as day}
                                    <th>
                                        <div>
                                            {day}
                                        </div>
                                    </th>
                                {/each}
                            </tr>
                        </thead>
                        <tbody>
                            {#each month.weeks as weekDates}
                                <tr>
                                    {#each weekDates as date}
                                        <td
                                            role="gridcell"
                                            aria-disabled={$isDateDisabled(date) ||
                                            $isDateUnavailable(date)}
                                        >
                                            <div use:melt={$cell(date, month.value)}>
                                                {date.day}
                                            </div>
                                        </td>
                                    {/each}
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {/each}
            </div>
        </div>
    </div>
{/if}
  
<style lang="postcss">
    .input {
        @apply flex flex-col gap-2 w-[95%];

        &.required label {
            @apply after:content-['*'] after:ml-1 after:text-error;
        }

        & > &__container {
            @apply flex items-stretch border-2 rounded-input bg-base-100 border-base-300 overflow-hidden;

            & > .icon{
                @apply bg-base-300 flex items-center justify-center min-w-12 max-w-12;
            }
        }
    }

    [data-melt-datefield-field] div:last-of-type {
        @apply ml-auto flex items-center justify-end;
    }
  
    [data-melt-popover-content] {
        @apply z-10 min-w-[320px] rounded-box bg-base-100 shadow-xl;
    }
  
    [data-melt-datefield-field] {
        @apply flex w-full items-center p-1.5;
    }

    [data-melt-datefield-segment] {
        @apply outline-none focus:text-primary;
    }
  
    [data-melt-datefield-segment][data-invalid] {
        @apply text-red-500;
    }
  
    [data-melt-datefield-segment]:not([data-segment='literal']) {
        @apply px-0.5;
    }
  
    [data-melt-datefield-validation] {
        @apply self-start text-red-500;
    }
  
    [data-melt-calendar] {
        @apply w-full rounded-box bg-base-100 text-base-content overflow-hidden;
    }
  
    [data-melt-calendar] > header {
        @apply flex items-center bg-neutral text-neutral-content justify-between p-2;
    }
  
    [data-melt-calendar] > header + div {
        @apply flex items-center gap-6 p-2;
    }
  
    [data-melt-calendar-prevbutton][data-disabled] {
        @apply pointer-events-none opacity-40;
    }
  
    [data-melt-calendar-nextbutton][data-disabled] {
        @apply pointer-events-none opacity-40;
    }
  
    [data-melt-calendar-heading] {
        @apply font-semibold;
    }
  
    th {
        @apply text-sm font-semibold;
  
        & div {
            @apply flex h-6 w-6 items-center justify-center p-4 text-primary;
        }
    }
  
    [data-melt-calendar-grid] {
        @apply w-full;
    }
  
    [data-melt-calendar-cell] {
        @apply flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-full p-4 outline-none hover:bg-primary/10 focus:ring-2 focus:ring-primary;
    }
  
    [data-melt-calendar-cell][data-disabled] {
        @apply pointer-events-none opacity-40;
    }
    [data-melt-calendar-cell][data-unavailable] {
        @apply pointer-events-none text-red-400 line-through;
    }
  
    [data-melt-calendar-cell][data-selected] {
        @apply bg-primary text-primary-content;
    }
  
    [data-melt-calendar-cell][data-outside-visible-months] {
        @apply pointer-events-none cursor-default text-neutral-500 hover:bg-transparent;
    }
  
    [data-melt-calendar-cell][data-outside-month] {
        @apply pointer-events-none cursor-default text-neutral-500 hover:bg-transparent;
    }
</style>