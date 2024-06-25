<script lang="ts">
  import { createAccordion } from '@melt-ui/svelte'
  import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

  export let className = ""
  export let multiple: boolean = false

  const {
    elements: { content, item, trigger, root },
    helpers: { isSelected },
    options: { multiple: mult }
  } = createAccordion({
    multiple: multiple
  })

  setContext("trigger", trigger)
  setContext("item", item)
  setContext("content", content)
  setContext("isSelected", isSelected)

  const items = writable<{id: string}[]>([])
  setContext("items", items)

  $: mult.set(multiple)
</script>
  
<div class={"accordion" + (className ? ` ${className}` : "")} {...$root}>
  <slot />
</div>

<style lang="postcss">
  .accordion {
    @apply w-full rounded-box bg-base-100 shadow-lg;
  }
</style>