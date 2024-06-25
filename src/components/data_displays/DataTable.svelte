<script lang="ts" context="module">
    type TableFieldType = "string" | "number" | "boolean" | "date" | "password" | "text"
    type TableFieldRender = (val: any) => {type: "value" | "markup", value: any}
    type TableFieldFlags = { 
        centered: boolean, 
        create: boolean, 
        change: boolean, 
        display: boolean, 
        required: boolean, 
        primary: boolean, 
    }
    type TableFieldExternalAccessor = {
        key: string,
        label: string,
    }

    type DataSource = (data?: {skip?: number, limit?: number}) => Promise<{data: Record<string, any>[], externalData: Record<string, Record<string, any>[]>, count: number}>
    type DataCreate = (fields: Record<string, any>) => Promise<{error?: string | Record<string, any>}>
    type DataChange = (key: string, value: any, fields: Record<string, any>) => Promise<{error?: string | Record<string, any>}>
    type DataDelete = (key: string, value: any) => Promise<{error?: string}>

    class TableField {
        public title: string
        public accessor: string
        public externalAccessor?: TableFieldExternalAccessor
        public type: TableFieldType
        public render?: TableFieldRender
        public flags: TableFieldFlags

        constructor(data: {
            title: string,
            accessor?: string,
            externalAccessor?: TableFieldExternalAccessor,
            type?: TableFieldType,
            render?: TableFieldRender
            centered?: boolean,
            create?: boolean,
            change?: boolean,
            display?: boolean,
            required?: boolean,
            primary?: boolean,
        }) {
            this.title = data.title
            this.accessor = data.accessor ?? this.title
            this.externalAccessor = data.externalAccessor
            this.type = data.type ?? "string"
            this.render = data.render
            this.flags = {
                centered: data.centered ?? false,
                create: data.create ?? true,
                change: data.change ?? true,
                display: data.display ?? true,
                required: data.required ?? true,
                primary: data.primary ?? false,
            }
        }

        public classes(): string {
            let classes: string[] = []
            
            if (this.flags.centered) classes.push("text-center")

            return classes.join(" ")
        }
    }

    export { TableField, type TableFieldType, type TableFieldRender, type DataSource, type DataCreate, type DataChange, type DataDelete, type TableFieldExternalAccessor }
</script>

<script lang="ts">
    import { onMount, tick } from "svelte"

	import Button from "$components/controllers/Button.svelte"
    import Dialog from "$components/controllers/Dialog.svelte"
    import Loading from "$components/feedback/Loading.svelte"
	import Input from "$components/inputs/Input.svelte"
    import Textarea from "$components/inputs/Textarea.svelte"
    import Select from "$components/inputs/Select.svelte"
    import Date from "$components/inputs/Date.svelte"
	import { showToast } from "$components/feedback/Toast.svelte"

    let isLoading: boolean = false

    let data: Record<string, any>[] = []
    let externalData: Record<string, Record<string, any>[]> = {}
    let count: number = 0
    let page: number = 0
    $: pageCount = Math.ceil(count / limit)

    const Back = function() {
        if (page < 1) return 

        page -= 1

        UpdateData()
    }

    const Forward = function() {
        if (page >= pageCount - 1) return

        page += 1

        UpdateData()
    }

    let createDialog: Dialog
    let createData: Record<string, any> = {}
    let createDataErrors: Record<string, any> = {}
    const ClearCreateDialog = function() {
        createData = {}
        createDataErrors = {}
        createDialog.Close()
    }

    let changeDialog: Dialog
    let changeData: Record<string, any> = {}
    let changeDataErrors: Record<string, any> = {}
    const ClearChangeDialog = function() {
        changeData = {}
        changeDataErrors = {}
        changeDialog.Close()
    }

    let deleteDialog: Dialog
    let deleteItem: Record<string, any> = {}
    const ClearDeleteDialog = function() {
        deleteItem = {}
        deleteDialog.Close()
    }

    const GetPrimaryKey = function() {
        return fields.filter(v => v.flags.primary)[0]?.accessor ?? fields[0]?.accessor ?? ""
    }

    export let source: DataSource
    export let create: DataCreate | null = null
    export let change: DataChange | null = null
    export let className: string = ""
    export let fields: TableField[] = []
    export let limit: number = 15

    let _delete: DataDelete | null = null
    export { _delete as delete }

    const UpdateData = async function() {
        isLoading = true

        const _data = await source({
            skip: page * limit,
            limit: limit,
        })

        data = _data.data
        externalData = _data.externalData
        count = _data.count

        await tick()

        isLoading = false
    }

    const SendCreate = async function() {
        if (!create) return

        const resp = await create(createData)

        if (resp.error) {
            if (typeof resp.error == "string") {
                ClearCreateDialog()

                showToast({
                    data: {
                        title: "Ошибка",
                        description: resp.error,
                        type: "error"
                    }
                })
                return
            }

            createDataErrors = resp.error

            return
        }

        ClearCreateDialog()

        showToast({
            data: {
                title: "Успех",
                description: "Запись успешно создана",
                type: "success"
            }
        })

        UpdateData()
    }

    const SendChange = async function() {
        if (!change) return

        const key = GetPrimaryKey()

        if (key == "") {
            console.warn("[DataTable]: Unable to find primary key")
            return
        }

        if (!changeData[key]) {
            console.warn("[DataTable]: Unable to find primary key value")
            return
        }

        const resp = await change(key, changeData[key], changeData)

        if (resp.error) {
            if (typeof resp.error == "string") {
                ClearChangeDialog()

                showToast({
                    data: {
                        title: "Ошибка",
                        description: resp.error,
                        type: "error"
                    }
                })
                return
            }

            changeDataErrors = resp.error

            return
        }

        ClearChangeDialog()

        showToast({
            data: {
                title: "Успех",
                description: "Запись успешно обновлена",
                type: "success"
            }
        })

        UpdateData()
    }

    const SendDelete = async function() {
        if (!_delete) return

        const key = GetPrimaryKey()

        if (key == "") {
            console.warn("[DataTable]: Unable to find primary key")
            return
        }

        if (!deleteItem[key]) {
            console.warn("[DataTable]: Unable to find primary key value")
            return
        }

        const resp = await _delete(key, deleteItem[key])

        if (resp.error) {
            showToast({
                data: {
                    title: "Ошибка",
                    description: resp.error,
                    type: "error"
                }
            })

            return
        }

        ClearDeleteDialog()
            
        showToast({
            data: {
                title: "Успех",
                description: "Запись успешно удалена",
                type: "success"
            }
        })
          
        UpdateData()
    }

    onMount(() => {
        UpdateData()
    })
</script>

{#if create}
    <Dialog title="Новая запись" bind:this={createDialog}>
        <svelte:fragment slot="body">
            {#each fields.filter(v => v.flags.create) as field, idx (idx)}
                {#if field.externalAccessor}
                    <Select 
                        label={field.title} 
                        name={field.accessor} 
                        required={field.flags.required} 
                        error={createDataErrors[field.accessor] ?? null} 
                        valueKey={field.externalAccessor.key}
                        labelKey={field.externalAccessor.label}
                        options={externalData[field.accessor]}
                        bind:value={createData[field.accessor]}
                    />
                {/if}

                {#if !field.externalAccessor && field.type == "string"}
                    <Input label={field.title} name={field.accessor} required={field.flags.required} error={createDataErrors[field.accessor] ?? null} bind:value={createData[field.accessor]} />
                {/if}

                {#if !field.externalAccessor && field.type == "number"}
                    <Input type="number" label={field.title} name={field.accessor} required={field.flags.required} error={createDataErrors[field.accessor] ?? null} bind:value={createData[field.accessor]} />
                {/if}

                {#if !field.externalAccessor && field.type == "password"}
                    <Input type="password" label={field.title} name={field.accessor} required={field.flags.required} error={createDataErrors[field.accessor] ?? null} bind:value={createData[field.accessor]} />
                {/if}

                {#if !field.externalAccessor && field.type == "date"}
                    <Date label={field.title} required={field.flags.required} error={createDataErrors[field.accessor] ?? null} bind:value={createData[field.accessor]} />
                {/if}

                {#if !field.externalAccessor && field.type == "text"}
                    <Textarea label={field.title} name={field.accessor} required={field.flags.required} error={createDataErrors[field.accessor] ?? null} bind:value={createData[field.accessor]} />
                {/if}
            {/each}
        </svelte:fragment>
        <svelte:fragment slot="footer">
            <div class="ml-auto"></div>
            <Button onClick={ClearCreateDialog}>Отмена</Button>
            <Button palette="neutral" onClick={SendCreate}>Добавить</Button>
        </svelte:fragment>
    </Dialog>
{/if}

{#if change}
    <Dialog title="Изменить запись" bind:this={changeDialog}>
        <svelte:fragment slot="body">
            {#each fields.filter(v => v.flags.change) as field, idx (idx)}
                {#if field.externalAccessor}
                    <Select 
                        label={field.title} 
                        name={field.accessor} 
                        required={field.flags.required} 
                        error={changeDataErrors[field.accessor] ?? null} 
                        valueKey={field.externalAccessor.key}
                        labelKey={field.externalAccessor.label}
                        options={externalData[field.accessor]}
                        bind:value={changeData[field.accessor]}
                    />
                {/if}

                {#if !field.externalAccessor && field.type == "string"}
                    <Input label={field.title} name={field.accessor} error={changeDataErrors[field.accessor] ?? null} bind:value={changeData[field.accessor]} />
                {/if}

                {#if !field.externalAccessor && field.type == "number"}
                    <Input type="number" label={field.title} name={field.accessor} error={changeDataErrors[field.accessor] ?? null} bind:value={changeData[field.accessor]} />
                {/if}

                {#if !field.externalAccessor && field.type == "password"}
                    <Input type="password" label={field.title} name={field.accessor} error={changeDataErrors[field.accessor] ?? null} bind:value={changeData[field.accessor]} />
                {/if}

                {#if !field.externalAccessor && field.type == "date"}
                    <Date label={field.title} error={changeDataErrors[field.accessor] ?? null} bind:value={changeData[field.accessor]} />
                {/if}

                {#if !field.externalAccessor && field.type == "text"}
                    <Textarea label={field.title} name={field.accessor} required={field.flags.required} error={changeDataErrors[field.accessor] ?? null} bind:value={changeData[field.accessor]} />
                {/if}
            {/each}
        </svelte:fragment>
        <svelte:fragment slot="footer">
            <div class="ml-auto"></div>
            <Button onClick={ClearChangeDialog}>Отмена</Button>
            <Button palette="neutral" onClick={SendChange}>Изменить</Button>
        </svelte:fragment>
    </Dialog>
{/if}

{#if _delete}
    <Dialog title="Удалить запись" disableClose bind:this={deleteDialog}>
        <svelte:fragment slot="body">
            <p>Вы действительно уверены, что хотите удалить выбранную запись?</p>
        </svelte:fragment>
        <svelte:fragment slot="footer">
            <div class="ml-auto"></div>
            <Button onClick={ClearDeleteDialog}>Отмена</Button>
            <Button palette="error" onClick={SendDelete}>Удалить</Button>
        </svelte:fragment>
    </Dialog>
{/if}

<div class={"overflow-x-auto bg-base-100 shadow-xl" + (className ? ` ${className}` : "")}>
    <table class="data-table">
        <thead>
            <tr>
                <th>№</th>
                {#each fields.filter(v => v.flags.display) as field, idx (idx)}
                    <th>{field.title}</th>
                {/each}
                <th>
                    {#if create}
                        <div class="flex items-center justify-end">
                            <Button onClick={() => createDialog.Open()} className="hover:!bg-success/20 !text-success" modifiers={{circle: 40, tranparent: true}}><i class="fa-solid fa-plus"></i></Button>
                        </div>
                    {/if}
                </th>
            </tr>
        </thead>
        <tbody>
            {#if isLoading}
                <tr>
                    <th colspan="999">
                        <Loading palette="primary"/>
                    </th>
                </tr>
            {/if}
            {#if !isLoading && data.length == 0}
                <tr>
                    <td colspan="999">
                        <div class="flex flex-col items-center gap-3">
                            <p class="text-neutral-500 text-xl">Записи отсутствуют</p>
                            {#if create}
                                <Button palette="success" onClick={() => createDialog.Open()}>
                                    <span class="fa-solid fa-plus"></span>
                                    <span>Создать новую</span>
                                </Button>
                                <div class="flex items-center justify-end">
                                </div>
                            {/if}
                        </div>
                    </td>
                </tr>
            {/if}
            {#each data as item, d_idx (d_idx)}
                <tr>
                    <th>{d_idx + 1}</th>
                    {#each fields.filter(v => v.flags.display) as field, f_idx (f_idx)}
                        {@const classes = field.classes()}
                        {@const itemData = item[field.accessor]}

                        {#if field.render}
                            {@const renderResult = field.render(itemData)}
                            
                            {#if renderResult.type == "value"}
                                <td class={classes}>
                                    <div class="max-w-xs break-words" class:mx-auto={field.flags.centered}>{renderResult.value}</div>
                                </td>
                            {/if}

                            {#if renderResult.type == "markup"}
                                <td class={classes}>
                                    {@html renderResult.value}
                                </td>
                            {/if}
                        {:else}
                            <td class={classes}>
                                <div class="max-w-xs break-words" class:mx-auto={field.flags.centered}>{itemData ?? ""}</div>
                            </td>
                        {/if}
                    {/each}
                    <th>
                        <slot item={{
                            data: item,
                            change: change ? () => {
                                changeData = JSON.parse(JSON.stringify(item, (key, value) => {
                                    const field = fields.find(v => v.accessor == key && v.externalAccessor)

                                    if (!field || !field.externalAccessor) return value

                                    return value[field.externalAccessor.key]
                                }))
                                changeDialog.Open()
                            } : undefined,
                            delete: _delete ? () => {
                                deleteItem = item,
                                deleteDialog.Open()
                            } : undefined,
                        }} />
                    </th>
                </tr>
            {/each}
        </tbody>
        <tfoot>
            <tr>
                <th colspan="2">Всего: {count}</th>
                <th colspan="999">
                    <div class="flex flex-row items-center justify-end gap-3">
                        <Button className="!text-neutral-content" modifiers={{fixedSize: 30, tranparent: true}} onClick={Back}><i class="fa-solid fa-chevron-left"></i></Button>
                        <p>{page + 1} из {pageCount}</p>
                        <Button className="!text-neutral-content" modifiers={{fixedSize: 30, tranparent: true}} onClick={Forward}><i class="fa-solid fa-chevron-right"></i></Button>
                    </div>
                </th>
            </tr>
        </tfoot>
    </table>
</div>

<style lang="postcss">
    .data-table {
        @apply table relative w-full rounded-box;

        & :where(thead, tfoot) {
            @apply whitespace-nowrap font-bold bg-neutral text-neutral-content;
        }

        & tbody {
            @apply text-base-content;
        }

        & :where(th,td) {
            @apply px-3 py-4 align-middle;
        }

        & :where(thead tr, tbody tr:not(:last-child), tbody tr:first-child:last-child) {
            @apply border-b-[1px] border-base-200;
        }

        & tbody tr:nth-child(2n+1) {
            @apply bg-base-100;
        }

        & tbody tr:nth-child(2n) {
            @apply bg-base-200;
        }
    }
</style>