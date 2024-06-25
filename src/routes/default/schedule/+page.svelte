<script lang="ts" context="module">
    type ScheduleItemModel = {
        period: string[],
        Start: string,
        End: string, 
        Timespan: string,
        Capacity: string
    }

</script>

<script lang="ts">
    import { onMount } from "svelte"

	import { showToast } from "$components/feedback/Toast.svelte"
    import Button from "$components/controllers/Button.svelte"
	import Select from "$components/inputs/Select.svelte"
	import Calendar from "$components/inputs/Calendar.svelte"
	import Accordion from "$components/data_displays/Accordion.svelte"
	import AccordionItem from "$components/data_displays/AccordionItem.svelte"
	import Input from "$components/inputs/Input.svelte"

    let calendarPicker: Calendar

    let doctors: Record<string, any>[] = []

    let addItemFormData: Record<number, ScheduleItemModel> = {}

    let doctor: number | null
    let range: string[][] = []
    let scheduleItems: {period: string[], items: Record<string, any>[]}[] = []

    $: range, GetSchedule()

    const GetDoctors = async function() {
        const resp = await fetch("/api/doctors").then(resp => resp.json())

        if (resp.code != 200) {
            return showToast({
                data: {
                    title: "Ошибка",
                    description: `Не удалось получить список врачей: ${resp.error}`,
                    type: "error"
                }
            })
        }

        doctors = (resp.data.list as Record<string, any>[]).map(v => ({id: Number(v.id), fio: `${v.LastName} ${v.FirstName} ${v.Patronymic}`.trim()}))
    }

    const GetSchedule = async function() {
        if (!doctor && range.length < 1) return

        let temp: {period: string[], items: Record<string, any>[]}[] = []

        const getScheduleKey = (items: Record<string, any>[]) => 
        JSON.stringify(items.map(item => JSON.stringify({Date: item.Date, Start: item.Start, End: item.End, Timespan: item.Timespan, Capacity: item.Capacity})))

        const scheduleFromKey = (key: string) => 
        (JSON.parse(key) as string[]).map<Record<string, any>>(item => JSON.parse(item))

        const savePeriod = (start: string, end: string, key: string) => 
        temp.push({
            period: [start, end],
            items: scheduleFromKey(key),
        })

        for (var i in range) {
            const dates = range[i]

            let start = String(dates[0])
            let end = String(dates.slice(-1)[0])

            let lastSchedule: string = ""

            for (var i in dates) {
                const date = dates[i]
                const prevDate = i == "0" ? date : dates[Number(i) - 1]

                end = String(date)

                const data = await fetch(`/api/schedule?doctor=${doctor}&start=${date}&end=${date}`).then(res => res.json())
                if (!data.data || !data.data.items) return

                const items = data.data.items as Record<string, any>[]

                const currentSchedule = getScheduleKey(items)

                if (i == "0") lastSchedule = getScheduleKey(items)

                if (currentSchedule == lastSchedule) continue

                end = String(prevDate)

                savePeriod(start, end, lastSchedule)

                start = String(date)

                lastSchedule = String(currentSchedule)
            }

            end = String(dates.slice(-1)[0])

            savePeriod(start, end, lastSchedule)
        }

        scheduleItems = temp
    }

    const CreateScheduleItem = async function(data: ScheduleItemModel) {
        for (var i in data.period.filter((value, index, array) => array.indexOf(value) === index)) {
            const res = await fetch(`/api/schedule`, {
                method: "POST",
                body: JSON.stringify({
                    data: {
                        items: [
                            {
                                Doctor: doctor,
                                Date: data.period[i],
                                Start: data.Start,
                                End: data.End,
                                Timespan: Number(data.Timespan),
                                Capacity: Number(data.Capacity),
                            }
                        ]
                    }
                })
            }).then(res => res.json())

            if (res.code != 200) {
                showToast({
                    data: {
                        title: "Ошибка",
                        description: "Не удалось сохранить расписание",
                        type: "error"
                    }
                })
                return
            }
        }

        showToast({
            data: {
                title: "Успех",
                description: "Промежуток успешно добавлен",
                type: "success"
            }
        })

        GetSchedule()
    }

    onMount(async () => {
        await GetDoctors()
    })
</script>

<h2>Расписание врачей</h2>

<div class="flex flex-col mt-3 gap-3">
    <Select className="max-w-sm" label="Врач" name="doctor" valueKey="id" labelKey="fio" options={doctors} bind:value={doctor}/>

    {#if doctor}
        <div class="max-w-7xl">
            <Calendar locale="ru-RU" multiple={true} numberOfMonth={3} bind:this={calendarPicker} bind:processedValue={range}/>
        </div>

        {#if range.length > 0}
            <Button 
                className="mr-auto" 
                palette="error"
                onClick={() => {
                    doctor = null
                    calendarPicker?.Clear()

                    range = []
                }}
            >
                <span class="fa-solid fa-eraser"></span>
                <span>Очистить выборку</span>
            </Button>

            <Accordion className="mt-5 max-w-5xl" multiple={true}>
                {#each scheduleItems as {period, items}, idx (idx)}
                    {@const startDate = new Date(Date.parse(period[0])).toLocaleDateString("ru-RU")}
                    {@const endDate = new Date(Date.parse(period.slice(-1)[0])).toLocaleDateString("ru-RU")}
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <AccordionItem>
                        <svelte:fragment slot="title">
                            {#if startDate == endDate}
                                {endDate}
                            {:else}
                                {startDate} - {endDate}
                            {/if}
                        </svelte:fragment>
                        <svelte:fragment slot="body">
                            

                            {#each items as item, idx (idx)}
                                <div class="flex flex-wrap items-center gap-3 pb-2">
                                    <span>{idx + 1}.</span> 
                                    <Input className="max-w-[160px]" label="Начало" labelInner name="start" type="time" value={item.Start} /> 
                                    <Input className="max-w-[160px]" label="Конец" labelInner name="end" type="time" value={item.End} />
                                    <Input className="max-w-[180px]" label="Интервал (мин.)" labelInner name="interval" type="number" value={item.Timespan} />
                                    <Input className="max-w-xs" label="Кол-во одновременных записей" labelInner name="amount" type="number" value={item.Capacity}/> 
                                    <Button className="hover:!bg-error/10 !text-error" modifiers={{circle: 40, tranparent: true}}><i class="fa-solid fa-trash"></i></Button>
                                </div>
                            {/each}

                            {#if addItemFormData[idx]}
                                <div class="flex flex-wrap items-center gap-3 pb-2">
                                    <span>Нов.</span> 
                                    <Input className="max-w-[160px]" label="Начало" labelInner name="start" type="time" bind:value={addItemFormData[idx].Start} /> 
                                    <Input className="max-w-[160px]" label="Конец" labelInner name="end" type="time" bind:value={addItemFormData[idx].End} />
                                    <Input className="max-w-[180px]" label="Интервал (мин.)" labelInner name="interval" type="number" bind:value={addItemFormData[idx].Timespan} />
                                    <Input className="max-w-xs" label="Кол-во одновременных записей" labelInner name="amount" type="number" bind:value={addItemFormData[idx].Capacity} /> 
                                    <Button onClick={() => {
                                        CreateScheduleItem(addItemFormData[idx])
                                        delete addItemFormData[idx]
                                        addItemFormData = addItemFormData
                                    }} palette="success">Добавить</Button>
                                    <Button onClick={() => {
                                        delete addItemFormData[idx]
                                        addItemFormData = addItemFormData
                                    }} palette="error">Отмена</Button>
                                </div>
                            {/if}
                            
                            <Button onClick={() => {
                                addItemFormData[idx] = {
                                    period: period,
                                    Start: "",
                                    End: "",
                                    Timespan: "30",
                                    Capacity: "1",
                                }
                                addItemFormData = addItemFormData
                            }} palette="success">
                                <span class="fa-solid fa-plus"></span>
                                <span>Добавить промежуток</span>
                            </Button>
                        </svelte:fragment>
                    </AccordionItem>
                {/each}
            </Accordion>
        {/if}
    {/if}
</div>