<script lang="ts">
	import DataTable, { TableField } from "$components/data_displays/DataTable.svelte"
	import Button from "$components/controllers/Button.svelte"
	import Dialog from "$components/controllers/Dialog.svelte"

    let exportDataDialog: Dialog

    const rootUrl = "/api/employees"

    const GetEmployee = async function(data?: {skip?: number, limit?: number}) {
        const resp = await fetch(`${rootUrl}?skip=${data?.skip ?? ""}&limit=${data?.limit ?? ""}`).then(resp => resp.json())

        return {
            data: resp.data.employees,
            externalData: resp.data.external,
            count: resp.data.count,
        }
    }

    const CreateEmployee = async function (fields: Record<string, any>) {
        const resp = await fetch(`${rootUrl}`, {
            method: "POST",
            body: JSON.stringify({
                data: fields
            })
        }).then(resp => resp.json())

        return {error: resp.error}
    }

    const ChangeEmployee = async function (key: string, value: any, fields: Record<string, any>) {
        const resp = await fetch(`${rootUrl}?${key}=${value}`, {
            method: "PUT",
            body: JSON.stringify({
                data: fields
            })
        }).then(resp => resp.json())

        return {error: resp.error}
    }

    const DeleteEmployee = async function (key: string, value: any) {
        const resp = await fetch(`${rootUrl}?${key}=${value}`, {
            method: "DELETE",
        }).then(resp => resp.json())

        return {error: resp.error}
    }
</script>

<h2>Управление сотрудниками</h2>

<div class="flex flex-row flex-wrap gap-3 mt-5">
    <Button palette="success">
        <span class="fa-solid fa-upload"></span>
        <span>Импорт данных</span>
    </Button>
    <Button onClick={() => exportDataDialog.Open()} palette="info">
        <span class="fa-solid fa-download"></span>
        <span>Экспорт данных</span>
    </Button>
</div>

<Dialog title="Экспорт данных" bind:this={exportDataDialog}>
    <svelte:fragment slot="body">
        <div class="grid grid-cols-2">
            <Button className="!flex-col" onClick={() => window.open(`${rootUrl}/export?type=json`)}>
                <svg width="100" height="100" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
                    <g stroke-width="0"></g>
                    <g stroke-linecap="round" stroke-linejoin="round"></g>
                    <g>
                        <defs>
                            <linearGradient id="a" x1="-683.873" y1="-565.884" x2="-664.125" y2="-585.635" gradientTransform="matrix(0.999, 0, 0, -0.999, 688.969, -558.754)" gradientUnits="userSpaceOnUse">
                                <stop offset="0"></stop><stop offset="1" stop-color="#ffffff"></stop>
                            </linearGradient>
                            <linearGradient id="b" x1="-663.231" y1="-584.741" x2="-682.979" y2="-564.99" xlink:href="#a"></linearGradient>
                        </defs>
                        <path d="M15.976,22.842c6.195,8.445,12.257-2.357,12.248-8.853C28.214,6.31,20.43,2.017,15.971,2.017A14.116,14.116,0,0,0,2,16.024C2,25.018,9.812,30,15.971,30c-1.394-.2-6.039-1.2-6.1-11.894-.042-7.236,2.36-10.126,6.091-8.855a7.106,7.106,0,0,1,4.115,6.816A7.132,7.132,0,0,1,15.976,22.842Z" style="fill:url(#a)"></path>
                        <path d="M15.969,9.245c-4.093-1.411-9.108,1.963-9.108,8.72C6.862,29,15.038,30,16.029,30A14.116,14.116,0,0,0,30,15.994C30,7,22.188,2.017,16.029,2.017c1.706-.236,9.195,1.846,9.195,12.081,0,6.675-5.592,10.308-9.229,8.756a7.106,7.106,0,0,1-4.115-6.816A7.17,7.17,0,0,1,15.969,9.245Z" style="fill:url(#b)"></path>
                    </g>
                </svg>
                <span class="mx-auto font-semibold">JSON</span>
            </Button>
            <Button className="!flex-col" onClick={() => window.open(`${rootUrl}/export?type=csv`)}>
                <svg width="100" height="100" viewBox="-4 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                    <g stroke-width="0"></g>
                    <g stroke-linecap="round" stroke-linejoin="round"></g>
                    <g> 
                        <path d="M5.106 0c-2.802 0-5.073 2.272-5.073 5.074v53.841c0 2.803 2.271 5.074 5.073 5.074h45.774c2.801 0 5.074-2.271 5.074-5.074v-38.605l-18.903-20.31h-31.945z" fill-rule="evenodd" clip-rule="evenodd" fill="#45B058"></path> 
                        <path d="M20.306 43.197c.126.144.198.324.198.522 0 .378-.306.72-.703.72-.18 0-.378-.072-.504-.234-.702-.846-1.891-1.387-3.007-1.387-2.629 0-4.627 2.017-4.627 4.88 0 2.845 1.999 4.879 4.627 4.879 1.134 0 2.25-.486 3.007-1.369.125-.144.324-.233.504-.233.415 0 .703.359.703.738 0 .18-.072.36-.198.504-.937.972-2.215 1.693-4.015 1.693-3.457 0-6.176-2.521-6.176-6.212s2.719-6.212 6.176-6.212c1.8.001 3.096.721 4.015 1.711zm6.802 10.714c-1.782 0-3.187-.594-4.213-1.495-.162-.144-.234-.342-.234-.54 0-.361.27-.757.702-.757.144 0 .306.036.432.144.828.739 1.98 1.314 3.367 1.314 2.143 0 2.827-1.152 2.827-2.071 0-3.097-7.112-1.386-7.112-5.672 0-1.98 1.764-3.331 4.123-3.331 1.548 0 2.881.467 3.853 1.278.162.144.252.342.252.54 0 .36-.306.72-.703.72-.144 0-.306-.054-.432-.162-.882-.72-1.98-1.044-3.079-1.044-1.44 0-2.467.774-2.467 1.909 0 2.701 7.112 1.152 7.112 5.636.001 1.748-1.187 3.531-4.428 3.531zm16.994-11.254l-4.159 10.335c-.198.486-.685.81-1.188.81h-.036c-.522 0-1.008-.324-1.207-.81l-4.142-10.335c-.036-.09-.054-.18-.054-.288 0-.36.323-.793.81-.793.306 0 .594.18.72.486l3.889 9.992 3.889-9.992c.108-.288.396-.486.72-.486.468 0 .81.378.81.793.001.09-.017.198-.052.288z" fill="#ffffff"></path> 
                        <g fill-rule="evenodd" clip-rule="evenodd"> 
                            <path d="M56.001 20.357v1h-12.8s-6.312-1.26-6.128-6.707c0 0 .208 5.707 6.003 5.707h12.925z" fill="#349C42"></path> 
                            <path d="M37.098.006v14.561c0 1.656 1.104 5.791 6.104 5.791h12.8l-18.904-20.352z" opacity=".5" fill="#ffffff"></path> 
                        </g> 
                    </g>
                </svg>
                <span class="mx-auto font-semibold">CSV</span>
            </Button>
        </div>
    </svelte:fragment>
</Dialog>

<DataTable 
    className="mt-5 max-w-6xl"
    fields={[
        new TableField({title: "ID", accessor: "id", type: "number", centered: true, create: false, change: false}),
        new TableField({title: "Логин", accessor: "Login", centered: true}),
        new TableField({title: "Имя", accessor: "FirstName", centered: true}),
        new TableField({title: "Фамилия", accessor: "LastName", centered: true}),
        new TableField({title: "Отчество", accessor: "Patronymic", centered: true, required: false}),
        new TableField({title: "Специальность", accessor: "Specification", centered: true, required: false}),
        new TableField({title: "Почта", accessor: "Email", centered: true, required: true}),
        new TableField({title: "Номер телефона", accessor: "Phone", centered: true, required: true}),
        new TableField({title: "О себе", accessor: "About", type: "text", centered: true, required: false, display: false}),
        new TableField({title: "Роль", accessor: "Role", centered: true, 
        externalAccessor: {
            key: "id",
            label: "Title",
        },
        render: (value) => {
            return {
                type: "markup",
                value: `<span class="text-info">${value.Title}</span>`,
            }
        }}),
        new TableField({title: "Пароль", accessor: "Password", type: "password", display: false}),
    ]}
    source={GetEmployee}
    create={CreateEmployee}
    change={ChangeEmployee}
    delete={DeleteEmployee}
    let:item
>
    <div class="flex items-center justify-center flex-wrap gap-3">
        <Button className="hover:!bg-info/10 !text-info" modifiers={{circle: 40, tranparent: true}} onClick={item.change}><i class="fa-solid fa-pen"></i></Button>
        {#if item.delete}
            <Button className="hover:!bg-error/10 !text-error" modifiers={{circle: 40, tranparent: true}} onClick={item.delete}><i class="fa-solid fa-trash"></i></Button>
        {/if}
    </div>
</DataTable>