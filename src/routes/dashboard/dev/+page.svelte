<script lang="ts">
    import { onMount } from "svelte"
	import DataTable, { TableField } from "$components/data_displays/DataTable.svelte"
	import Button from "$components/controllers/Button.svelte"
    import Accordion from "$components/data_displays/Accordion.svelte"
	import ApiRoute from "$components/data_displays/ApiRoute.svelte"

	import type { ApiRouteDefinition } from "$lib/api"

    const rootUrl = "/api/dashboard/tokens"

    const GetTokens = async function(data?: {skip?: number, limit?: number}) {
        const resp = await fetch(`${rootUrl}?skip=${data?.skip ?? ""}&limit=${data?.limit ?? ""}`).then(resp => resp.json())

        return {
            data: resp.data.tokens,
            externalData: resp.data.external,
            count: resp.data.count,
        }
    }

    const CreateToken = async function (fields: Record<string, any>) {
        const resp = await fetch(`${rootUrl}`, {
            method: "POST",
            body: JSON.stringify({
                data: fields
            })
        }).then(resp => resp.json())

        return {error: resp.error}
    }

    const DeleteToken = async function (key: string, value: any) {
        const resp = await fetch(`${rootUrl}?${key}=${value}`, {
            method: "DELETE",
        }).then(resp => resp.json())

        return {error: resp.error}
    }

    let apiRoutes: ApiRouteDefinition[] = []
    const GetRoutes = async function () {
        apiRoutes = (await fetch("/api/schema").then(res => res.json()))["data"]
    }

    onMount(() => {
        GetRoutes()
    })
</script>

<h2>API для разработчиков</h2>

<p class="mt-5 text-neutral-500">API доступна по следущему маршруту - <b><span class="text-info">имя хоста</span>/api</b></p>

<Button onClick={() => window.open("/api/schema", "_blank")} className="mr-auto mt-5" palette="info">
    <span class="fa-solid fa-up-right-from-square"></span>
    <span>Схема в формате JSON</span>
</Button>

<Accordion className="mt-5 max-w-4xl" multiple={true}>
    {#each apiRoutes as route, idx (idx)}
        <ApiRoute definition={route}/>
    {/each}
</Accordion>

<div>
    <DataTable 
        className="mt-5 max-w-4xl"
        fields={[
            new TableField({title: "ID", accessor: "id", type: "number", centered: true, create: false, change: false}),
            new TableField({title: "Токен", accessor: "Token", centered: true, create: false, change: false}),
            new TableField({title: "Пометка", accessor: "Note", centered: true}),
            new TableField({title: "Годен до", accessor: "Exp", type: "date", centered: true, create: false, change: false,
            render: (value) => {
                return {
                    type: "markup",
                    value: `<span class="text-info">${value < 1 ? "без срока" : new Date(value).toLocaleDateString("ru-RU")}</span>`,
                }
            }}),
            new TableField({title: "Срок (дн.)", accessor: "Exp", type: "number", centered: true, required: false, display: false}),
        ]}
        source={GetTokens}
        create={CreateToken}
        delete={DeleteToken}
        let:item
    >
        <div class="flex items-center justify-center flex-wrap gap-3">
            {#if item.change}
                <Button className="hover:!bg-info/10 !text-info" modifiers={{circle: 40, tranparent: true}} onClick={item.change}><i class="fa-solid fa-pen"></i></Button>
            {/if}
            {#if item.delete}
                <Button className="hover:!bg-error/10 !text-error" modifiers={{circle: 40, tranparent: true}} onClick={item.delete}><i class="fa-solid fa-trash"></i></Button>
            {/if}
        </div>
    </DataTable>
</div>