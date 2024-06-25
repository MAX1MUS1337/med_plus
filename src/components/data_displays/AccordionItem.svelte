<script lang="ts" context="module">
    import type { Action } from 'svelte/action'
	import type { Invalidator, Readable, Subscriber, Unsubscriber, Updater, Writable } from 'svelte/store'
    import type { GroupedEvents, MeltActionReturn } from '@melt-ui/svelte/internal/types'
    import type { MeltElement, WithGet } from '@melt-ui/svelte/internal/helpers'
    import type { AccordionItemProps } from '@melt-ui/svelte'

    declare const accordionEvents: {
        trigger: readonly ["keydown", "click"];
    }

    type AccordionEvents = GroupedEvents<typeof accordionEvents>

    type itemType = MeltElement<{
        update: (updater: Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
        set: (this: void, value: string | string[] | undefined) => void;
        subscribe(this: void, run: Subscriber<string | string[] | undefined>, invalidate?: Invalidator<string | string[] | undefined> | undefined): Unsubscriber;
        get: () => string | string[] | undefined;
        destroy?: (() => void) | undefined;
    }, Action<any, any, Record<never, any>>, ($value: string | string[] | undefined) => (props: AccordionItemProps) => {
        'data-state': string;
        'data-disabled': boolean | undefined;
    }, string>

    type triggerType = MeltElement<[{
        update: (updater: Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
        set: (this: void, value: string | string[] | undefined) => void;
        subscribe(this: void, run: Subscriber<string | string[] | undefined>, invalidate?: Invalidator<string | string[] | undefined> | undefined): Unsubscriber;
        get: () => string | string[] | undefined;
        destroy?: (() => void) | undefined;
    }, WithGet<Writable<boolean>>], (node: HTMLElement) => MeltActionReturn<AccordionEvents['trigger']>, ([$value, $disabled]: [string | string[] | undefined, boolean]) => (props: AccordionItemProps) => {
        disabled: boolean | undefined;
        'aria-expanded': boolean;
        'aria-disabled': boolean;
        'data-disabled': boolean | undefined;
        'data-value': string;
        'data-state': string;
    }, string>

    type contentType = MeltElement<[{
        update: (updater: Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
        set: (this: void, value: string | string[] | undefined) => void;
        subscribe(this: void, run: Subscriber<string | string[] | undefined>, invalidate?: Invalidator<string | string[] | undefined> | undefined): Unsubscriber;
        get: () => string | string[] | undefined;
        destroy?: (() => void) | undefined;
    }, WithGet<Writable<boolean>>, WithGet<Writable<boolean>>], (node: HTMLElement) => void, ([$value, $disabled, $forceVisible]: [string | string[] | undefined, boolean, boolean]) => (props: AccordionItemProps) => {
        'data-state': string;
        'data-disabled': boolean | undefined;
        'data-value': string;
        hidden: boolean | undefined;
        style: string;
    }, string>
    
</script>

<script lang="ts">
	import { getContext } from 'svelte'

  import { slide } from 'svelte/transition'

  import { melt } from '@melt-ui/svelte'

  const item = getContext<itemType>("item")
  const trigger = getContext<triggerType>("trigger")
  const content = getContext<contentType>("content")
  const isSelected = getContext<Readable<(key: string) => boolean>>("isSelected")

  const items = getContext<Writable<{id: string}[]>>("items")
  const index = ($items).length
  const id = `item-${index}`
  $items.push({id: id})
</script>

<div use:melt={$item(id)} class="accordion-item">
  <div class={"accordion-item__trigger" + (index != 0 ? " border-t border-t-base-200" : "")}>
    <button 
      use:melt={$trigger(id)}
    >
      <slot name="title" />
    </button>
    <span use:melt={$trigger(id)} class={"fa-solid fa-chevron-down" + ($isSelected(id) ? ` -rotate-180` : "")}></span>
  </div>
  {#if $isSelected(id)}
    <div
      class="accordion-item__body"
      use:melt={$content(id)}
      transition:slide
    >
      <div class="px-5 py-4 flex flex-col">
        <slot name="body" />
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .accordion-item {
    @apply overflow-hidden transition-colors first:rounded-t-xl last:rounded-b-xl;

    & > &__trigger {
      @apply cursor-pointer flex flex-row items-center gap-3 justify-between;

      & > button {
        @apply px-5 py-5  flex flex-1 cursor-pointer items-center bg-base-100 text-base font-medium leading-none text-base-content transition-colors !outline-none focus:!ring-0 focus-visible:text-primary;
      }

      & > span {
        @apply px-5 py-5 transition-transform duration-300;
      }
    }

    & > &__body {
      @apply overflow-hidden bg-base-200 text-sm text-base-content border-t border-t-base-200;
    }
  }
</style>