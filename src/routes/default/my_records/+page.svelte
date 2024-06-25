<script lang="ts">
    import { onMount } from "svelte"

	import Button from "$components/controllers/Button.svelte"
	import Select from "$components/inputs/Select.svelte"
	import Card from "$components/containers/Card.svelte"

    let isLoading: boolean = false

    let disableManageButtonsDelta: number = 5

    let year: string | null = null
    let yearOptions: Record<string, any>[] = []

    let currentDate: Date = new Date()

    let currentYear: string = currentDate.toLocaleDateString("ru-RU", {year: "numeric"})
    let currentMonth: string = currentDate.toLocaleDateString("ru-RU", {month: "2-digit"})

    const GetYearOptions = function() {
        let temp: Record<string, any>[] = []

        for (var i = Number(currentYear); Number(currentYear) - i < 5; i--) temp.push({value: String(i), label: String(i)})

        yearOptions = temp
    }

    let period: string | null = null
    let periodOptions: Record<string, any>[] = [
        {value: "month", label: "За месяц"},
        {value: "year", label: "За год"},
        {value: "full", label: "За всё время"}
    ]
    let month: string | null = null
    let monthOptions: Record<string, any>[] = [
        {value: "01", label: "Январь"},
        {value: "02", label: "Февраль"},
        {value: "03", label: "Март"},
        {value: "04", label: "Апрель"},
        {value: "05", label: "Май"},
        {value: "06", label: "Июнь"},
        {value: "07", label: "Июль"},
        {value: "08", label: "Август"},
        {value: "09", label: "Сентябрь"},
        {value: "10", label: "Октябрь"},
        {value: "11", label: "Ноябрь"},
        {value: "12", label: "Декабрь"},
    ]

    $: period, GetRecords()

    let records: Record<string, any>[] = []

    const GetRecords = async function() {
        isLoading = true

        switch (period) {
            case "month":
                year = String(currentYear)
                month = String(currentMonth)
                break
            case "year":
                month = null
                break
            case "full":
                year = null
                month = null
                break
        }

        let temp: Record<string, any>[] = []

        temp.push({
            date: new Date(),
            time: "12:00",
            doctor: "Тестов Тест Тестович",
            specification: "Стоматолог",
            offer: "Консультация",
            state: 1,
        })

        let date = new Date()
        date.setDate(date.getDate() + 12)

        temp.push({
            date: date,
            time: "12:00",
            doctor: "Тестов Тест Тестович",
            specification: "Стоматолог",
            offer: "Консультация",
            state: 1,
        })
 
        records = temp

        isLoading = false
    }

    onMount(() => {
        period = "month"

        GetYearOptions()
    })
</script>

<h2>Мои записи</h2>

<a class="mt-5 mr-auto" href="/default/new_appointment" target="_blank">
    <Button palette="success">
        <span class="fa-solid fa-calendar-check"></span>
        <span>Записаться</span>
    </Button>
</a>

<div class="flex flex-col mt-5">
    <h3>Предстоящие</h3>
    <hr class="border-2 border-base-300 my-2">

    <div class="flex flex-row flex-wrap gap-3">
        {#each records.filter(r => r.state == 1) as record, idx (idx)}
            {@const delta = record.date.getDay() - currentDate.getDay()}
            <Card className="max-w-md">
                <svelte:fragment slot="body">
                    <span class="text-lg font-semibold">{record.specification}</span>
                    <span class="italic text-neutral-400">{record.offer}</span>
                    <br>
                    <div class="flex flex-row items-center justify-between gap-3 flex-wrap">
                        <span class="text-primary"><i class="fa-solid fa-user-doctor"></i> {record.doctor}</span>
                        <span class="text-info"><i class="fa-solid fa-clock"></i> {record.date.toLocaleDateString("ru-RU", {day: "numeric", month: "long", year: "numeric"})} {record.time}</span>
                    </div>
                    <div class="absolute right-2 top-2 flex flex-col gap-2">
                        <Button palette="info" disabled={delta < disableManageButtonsDelta}>
                            <span class="fa-solid fa-rotate"></span>
                            <span>Перенести</span>
                        </Button>
                        <Button palette="error" disabled={delta < disableManageButtonsDelta}>
                            <span class="fa-solid fa-xmark"></span>
                            <span>Отменить</span>
                        </Button>
                    </div>
                </svelte:fragment>
            </Card>
        {/each}
    </div>

    <br>
    <h3>Архив</h3>
    <hr class="border-2 border-base-300 my-2">

    <div class="flex flex-row items-center flex-wrap gap-3">
        <Select className="max-w-xs" label="Период" name="period" options={periodOptions} bind:value={period}/>

        {#if period == "month"}
            <Select className="max-w-xs" label="Месяц" name="month" options={monthOptions} bind:value={month}/>
        {/if}

        {#if period == "year"}
            <Select className="max-w-xs" label="Год" name="month" options={yearOptions} bind:value={year}/>
        {/if}
    </div>

    {#if period}
        <Button className="mt-5 mr-auto" palette="primary" onClick={GetRecords}>
            <span class="fa-solid fa-rotate-right"></span>
            <span>Обновить</span>
        </Button>
    {/if}

    
</div>