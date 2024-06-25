<script lang="ts">
    import { readable, writable } from 'svelte/store'

    import { createCalendar, melt } from '@melt-ui/svelte' 

    import { type DateValue } from '@internationalized/date'

    const wl = writable<string[]>([])

    const UpdateValue = function(val?: DateValue | DateValue[]) {
        if (!val) {
            value = multiple ? [] : ""
            processedValue = []
            return
        }

        if (Array.isArray(val)) {
            value = val.map(v => v.toString())

            let temp: DateValue[][] = []
            let idx: number = 0

            val.sort((a, b) => a > b ? 1 : -1).forEach((v, i, arr) => {
                if (i == 0) {
                    temp[idx] = []
                    temp[idx].push(v)

                    return
                }

                const prev = arr[i - 1]

                if (temp[idx].includes(prev) && v.compare(prev) == 1) {
                    temp[idx].push(v)

                    return
                }

                idx += 1

                temp[idx] = []

                temp[idx].push(v)
            })

            processedValue = temp.map(v => v.map(v => v.toString()))

            return
        }

        value = val.toString()
        processedValue = [[val.toString()]]
    }

    const isDateMarked = readable((date: DateValue, month: DateValue): boolean => {
        const marked = markDays.mode == "blacklist" 
        ? (markDays.days ? markDays.days.includes(date.toString()) : false) 
        : (markDays.days ? !markDays.days.includes(date.toString()) : true)

        if (marked) {
            return !$isDateUnavailable(date) && month.month == date.month
        }

        return false
    })

    export const Clear = function() {
        if (multiple) $val = []
        else $val = undefined
    }

    export let required: boolean = false
    export let title: string = ""
    export let locale: string
    export let multiple: boolean = false
    export let numberOfMonth: number = 1
    export let whitelist: string[] = []
    export let value: string | string[] = ""
    export let processedValue: string[][] = []
    export let markDays: {days?: string[], color?: string, mode?: "whitelist" | "blacklist"} = {days: [], color: "", mode: "blacklist"}

    const {
        elements: { calendar, heading, grid, cell, prevButton, nextButton },
        states: { months, headingValue, weekdays, value: val },
        helpers: { isDateDisabled, isDateUnavailable },
        options: { locale: loc, multiple: mult, numberOfMonths: nom },
    } = createCalendar<boolean>({
        multiple: multiple,
        locale: locale,
        numberOfMonths: numberOfMonth,
        isDateUnavailable: (date) => {
            return $wl.length > 0 ? !$wl.includes(date.toString()) : false
        }
    })

    $: UpdateValue($val)

    $: loc.set(locale)
    $: mult.set(multiple)
    $: nom.set(numberOfMonth)
    $: wl.set(whitelist)
</script>

<div class={"dui-form-control" + (required ? " required" : "")}>
    {#if title != ""}
      <div class="dui-label">
          <span class="dui-label-text">{title}</span>
      </div>
    {/if}

    <div use:melt={$calendar}>
        <header>
          <button use:melt={$prevButton}>
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <div use:melt={$heading}>
            {$headingValue}
          </div>
          <button use:melt={$nextButton}>
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </header>
        <div class="flex flex-row justify-center items-center flex-wrap">
          {#each $months as month}
            <table class="max-w-sm" use:melt={$grid}>
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
                                    <div use:melt={$cell(date, month.value)} style={$isDateMarked(date, month.value) ? `color: ${markDays.color || "red"}` : ``}>
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

<style lang="postcss">
    [data-melt-popover-content] {
        @apply z-[1000] min-w-[300px];
    }

    [data-melt-datefield-segment] {
        @apply focus:text-primary transition-colors duration-300;
    }

    [data-melt-calendar] {
        @apply w-full rounded-box shadow-lg bg-base-100 text-base-content overflow-hidden;
    }

    [data-melt-calendar] header {
        @apply flex items-center justify-between bg-neutral text-neutral-content;
    }

    [data-melt-calendar] header + div {
        @apply flex items-center gap-6 px-3 pb-3;
    }

    [data-melt-calendar-prevbutton], [data-melt-calendar-nextbutton] {
        @apply p-3 rounded-full w-14 h-14 !outline-none focus:text-primary-content;
    }

    [data-melt-calendar-prevbutton][data-disabled], [data-melt-calendar-nextbutton][data-disabled] {
        @apply hidden;
    }

    [data-melt-calendar-heading] {
        @apply font-semibold;
    }

    [data-melt-calendar] th {
        @apply text-sm font-bold;
    
        & div {
        @apply flex h-6 w-6 items-center text-primary justify-center p-4;
        }
    }

    [data-melt-calendar-grid] {
        @apply w-full;
    }

    [data-melt-calendar-cell] {
        @apply flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-lg p-4 hover:bg-primary/20 !outline-none focus:ring focus:ring-primary;
    }

    [data-melt-calendar-cell][data-disabled] {
        @apply pointer-events-none text-neutral-500;
    }
    [data-melt-calendar-cell][data-unavailable] {
        @apply pointer-events-none text-error line-through;
    }

    [data-melt-calendar-cell][data-selected] {
        @apply bg-primary/20 text-primary;
    }

    [data-melt-calendar-cell][data-outside-visible-months] {
        @apply pointer-events-none cursor-default text-neutral-400 no-underline;
    }

    [data-melt-calendar-cell][data-outside-month] {
        @apply pointer-events-none cursor-default text-neutral-400 no-underline;
    }
</style>