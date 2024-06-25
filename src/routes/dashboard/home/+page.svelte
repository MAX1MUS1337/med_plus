<script lang="ts">
	import Card from '$components/containers/Card.svelte'
	import { generateForegroundColorFrom } from '$lib/colors.js'

    export let data
</script>

<h2 class="text-center">Добро пожаловать в панель управления</h2>
<p class="text-xl text-center font-semibold text-neutral-400 mt-5">Выберите нужный раздел</p>

<div class="flex items-center justify-center flex-wrap mt-3 gap-5">
    {#each data.links.filter(v => v.href != "/home") as link, idx (idx)}
        {@const url = `/dashboard/${link.href}`.replaceAll("//", "/")}
        {@const styles = link.color ? Object.entries({"background-color": link.color, "color": `rgb(${generateForegroundColorFrom(link.color)})`}).map(v => `${v[0]}: ${v[1]}`).join(";") : ""}
        <a href={url}>
            <Card partStyling={{body: {class: "py-2"}}} styles={styles}>
                <svelte:fragment slot="body">
                    <div class="flex flex-row items-center h-full gap-3">
                        {#if link.icon}
                            <span class={`${link.icon} fa-lg`}></span>
                        {/if}
                        <span class="text-center">{link.title}</span>
                    </div>
                </svelte:fragment>
            </Card>
        </a>
    {/each}
</div>