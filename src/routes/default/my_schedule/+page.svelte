<script lang="ts">
	import { onMount } from "svelte"

    import DateInput from "$components/inputs/Date.svelte"
	import Loading from "$components/feedback/Loading.svelte"
	import Button from "$components/controllers/Button.svelte"

    let isLoading: boolean = false

    let date: string = ""
    let records: Record<string, any>[] = []

    const GetRecords = async function() {
        isLoading = true

        var start = new Date(1970, 0, 1, 8, 0, 0, 0)
        var end = new Date(1970, 0, 1, 17, 0, 0, 0)

        let temp: Record<string, any>[] = []

        for (; start <= end; start.setMinutes(start.getMinutes() + 30)) {
            const time = start.toLocaleTimeString("ru-RU", {hour: "2-digit", minute: "2-digit"})

            temp.push({
                time: time,
                patient: time == "09:00" ? "Иванов Иван Иванович" : time == "09:30" ? "Тестов Тест Тестович" : time == "12:00" ? "Антонов Максим Олегович" : undefined,
                offer: "Консультация",
                state: time == "09:00" ? 3 : time == "09:30" ? 2 : time == "12:00" ? 1 : undefined
            })
        }

        records = temp

        isLoading = false
    }
    $: date, GetRecords()

    onMount(() => {
        date = new Date().toISOString().split("T")[0]
    })
</script>

<h2>Моё расписание</h2>

<DateInput className="max-w-xs mt-5" label="Дата" bind:value={date} />

<Button className="mt-5 mr-auto" palette="primary" onClick={GetRecords}>
    <span class="fa-solid fa-rotate-right"></span>
    <span>Обновить</span>
</Button>

{#if date}
    {#if isLoading}
        <Loading />
    {:else}
        <div class="flex flex-col divide-y-2 divide-base-300 mt-5">
            {#if records.length == 0}
                <h3 class="text-neutral-500 text-center">Расписание на выбранный день отсутствует</h3>
            {/if}

            {#each records as record, idx (idx)}
                <div class="flex flex-col gap-3 md:flex-row items-center px-10 py-10">
                    <p class="text-xl text-primary">{record.time}</p>

                    {#if record.patient}
                        <div class="flex flex-col gap-3 md:ml-10 text-center md:text-left">
                            <p class="text-2xl font-bold">{record.patient}</p>
                            <p>Услуга: <span class="italic text-info">{record.offer}</span></p>
                        </div>
                    {/if}

                    {#if record.state}
                        {#if record.state == 1}
                            <Button className="md:ml-auto" palette="success">
                                <span>Принять</span>
                            </Button>
                        {/if}
                        {#if record.state == 2}
                            <Button className="md:ml-auto" palette="error">
                                <span>Завершить приём</span>
                            </Button>
                        {/if}
                        {#if record.state == 3}
                            <p class="text-neutral-400 md:ml-auto">Приём завершён</p>
                        {/if}
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
{/if}