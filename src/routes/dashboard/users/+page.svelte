<script lang="ts">
	import DataTable, { TableField } from "$components/data_displays/DataTable.svelte"
	import Button from "$components/controllers/Button.svelte"

    const rootUrl = "/api/dashboard/users"

    const GetUsers = async function(data?: {skip?: number, limit?: number}) {
        const resp = await fetch(`${rootUrl}?skip=${data?.skip ?? ""}&limit=${data?.limit ?? ""}`).then(resp => resp.json())

        return {
            data: resp.data.users,
            externalData: resp.data.external,
            count: resp.data.count,
        }
    }

    const CreateUser = async function (fields: Record<string, any>) {
        const resp = await fetch(`${rootUrl}`, {
            method: "POST",
            body: JSON.stringify({
                data: fields
            })
        }).then(resp => resp.json())

        return {error: resp.error}
    }

    const ChangeUser = async function (key: string, value: any, fields: Record<string, any>) {
        const resp = await fetch(`${rootUrl}?${key}=${value}`, {
            method: "PUT",
            body: JSON.stringify({
                data: fields
            })
        }).then(resp => resp.json())

        return {error: resp.error}
    }

    const DeleteUser = async function (key: string, value: any) {
        const resp = await fetch(`${rootUrl}?${key}=${value}`, {
            method: "DELETE",
        }).then(resp => resp.json())

        return {error: resp.error}
    }

    export let data
</script>

<h2>Управление пользователями</h2>

<DataTable 
    className="mt-5 max-w-3xl"
    fields={[
        new TableField({title: "ID", accessor: "id", type: "number", centered: true, create: false, change: false}),
        new TableField({title: "Логин", accessor: "Login", centered: true}),
        new TableField({title: "Имя", accessor: "FirstName", centered: true, required: false}),
        new TableField({title: "Фамилия", accessor: "LastName", centered: true, required: false}),
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
    source={GetUsers}
    create={CreateUser}
    change={ChangeUser}
    delete={DeleteUser}
    let:item
>
    <div class="flex items-center justify-center flex-wrap gap-3">
        <Button className="hover:!bg-info/10 !text-info" modifiers={{circle: 40, tranparent: true}} onClick={item.change}><i class="fa-solid fa-pen"></i></Button>
        {#if data.user.id != item.data.id && item.delete}
            <Button className="hover:!bg-error/10 !text-error" modifiers={{circle: 40, tranparent: true}} onClick={item.delete}><i class="fa-solid fa-trash"></i></Button>
        {/if}
    </div>
</DataTable>