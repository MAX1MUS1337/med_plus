<script lang="ts" context="module">
	

    const paletteSettings: Record<string, "" | "primary" | "neutral" | "info" | "success" | "warning" | "error"> = {
        "GET": "success",
        "POST": "info",
        "PUT": "warning",
        "DELETE": "error",
        "PATCH": "neutral",
        "TRACE": "neutral"
    }

</script>

<script lang="ts">
    import Accordion from "$components/data_displays/Accordion.svelte"
    import AccordionItem from "$components/data_displays/AccordionItem.svelte"
	import Badge from "$components/data_displays/Badge.svelte"

	import type { ApiRouteDefinition } from "$lib/api"

    export let definition: ApiRouteDefinition
</script>

<AccordionItem>
    <div class="flex flex-row items-center gap-2" slot="title">
        {#if definition.protected}
            <i class="fa-solid fa-user-shield text-primary"></i>
        {/if}
        {#if definition.method}
            <Badge palette={paletteSettings[definition.method]}>{definition.method}</Badge>  
        {/if}

        {definition.path}
    </div>
    <div class="flex flex-col gap-2" slot="body">
        <span class="description">{definition.description ?? "Описание отсутствует"}</span>

        {#if definition.inputArgs}
            <span class="font-semibold">Входные параметры</span>

            <div class="ml-3 flex flex-col bg-neutral text-neutral-content rounded-box">
                {#each definition.inputArgs as arg, idx (idx)}
                    <div class="flex flex-row items-center gap-3 py-2 px-3">
                        <span class="text-info">{arg.name}</span>
                        <span>{arg.type}</span>
                        {#if arg.description}
                            <span class="description">{arg.description}</span>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}

        {#if definition.outputArgs}
            <span class="font-semibold">Выходные параметры</span>

            <div class="ml-3 flex flex-col bg-neutral text-neutral-content rounded-box">
                {#each definition.outputArgs as arg, idx (idx)}
                    <div class="flex flex-row items-center gap-3 py-2 px-3">
                        <span class="text-warning">{arg.name}</span>
                        <span>{arg.type}</span>
                        {#if arg.description}
                            <span class="description">{arg.description}</span>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}

        {#if definition.routes}
            <span class="font-semibold">Маршруты</span>
            <Accordion className="mt-2" multiple={true}>
                {#each definition.routes as route, idx (idx)}
                    <svelte:self definition={route}/>
                {/each}
            </Accordion>
        {/if}
    </div>
</AccordionItem>

<style lang="postcss">
    .description {
        @apply italic text-neutral-400;
    }
</style>