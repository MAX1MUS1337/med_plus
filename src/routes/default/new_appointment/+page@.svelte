<script lang="ts">
	import { onMount } from "svelte"
    import { fade } from 'svelte/transition'

    import { showToast } from "$components/feedback/Toast.svelte"
	import Card from "$components/containers/Card.svelte"
	import Input from "$components/inputs/Input.svelte"
	import Select from "$components/inputs/Select.svelte"
    import Loading from "$components/feedback/Loading.svelte"
	import DateInput from "$components/inputs/Date.svelte"
	import Button from "$components/controllers/Button.svelte"

    let isLoading: boolean = false

    let specifications: Record<string, any>[] = []
    let doctors: Record<string, any>[] = []
    let offers: Record<string, any>[] = []

    let recordData: Record<string, any> = {
        id: null,
        name: null,
        surname: null,
        patronymic: null,
        email: null,
        phone: null,
        specification: null,
        doctor: null,
        offer: null,
        date: null,
        time: null,
    }
    let timeIntervals: string[] = []

    const GetSpecifiactions = async function() {
        const resp = await fetch("/api/specifications").then(resp => resp.json())

        if (resp.code != 200) {
            return showToast({
                data: {
                    title: "Ошибка",
                    description: `Не удалось получить список специальностей: ${resp.error}`,
                    type: "error"
                }
            })
        }

        specifications = resp.data
    }

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

        doctors = (resp.data.list as Record<string, any>[]).map(v => ({id: Number(v.id), fio: `${v.LastName} ${v.FirstName} ${v.Patronymic}`.trim(), specification: v.Specification}))
    }

    const GetOffers = async function() {
        const resp = await fetch("/api/offers").then(resp => resp.json())

        if (resp.code != 200) {
            return showToast({
                data: {
                    title: "Ошибка",
                    description: `Не удалось получить список услуг: ${resp.error}`,
                    type: "error"
                }
            })
        }

        offers = (resp.data.offers as Record<string, any>[]).map(v => ({id: Number(v.id), title: v.Title}))
    }

    const GetTimeIntervals = async function(doctor?: number, date?: string) {
        if (!doctor || !date) return

        const resp = await fetch(`/api/schedule/time_intervals?doctor=${doctor}&date=${date}`).then(resp => resp.json())

        if (resp.code === 400) {
            return showToast({
                data: {
                    title: "Ошибка",
                    description: `Не удалось получить свободное время записей: ${resp.error}`,
                    type: "error"
                }
            })
        }

        if (resp.code !== 200) {
            return showToast({
                data: {
                    title: "Ошибка",
                    description: `Не удалось получить свободное время записей: Произошла непредвиденная ошибка`,
                    type: "error"
                }
            })
        }

        timeIntervals = resp.data
    }
    $: GetTimeIntervals(recordData["doctor"], recordData["date"])

    const PreloadData = async function() {
        try {
            const resp = await fetch("/api/patients/me").then(resp => resp.json())

            if (resp.code !== 200) return

            recordData["id"] = resp.data.id
            recordData["name"] = resp.data.name
            recordData["surname"] = resp.data.surname
            recordData["patronymic"] = resp.data.patronymic
            recordData["email"] = resp.data.email
            recordData["phone"] = resp.data.phone
        } catch {

        }
    }

    const Submit = async function () {
        const resp = await fetch("/api/records", {
            method: "POST",
            body: JSON.stringify({
                data: {
                    Patient: recordData["id"] ?? undefined,
                    Doctor: recordData["doctor"],
                    Offer: recordData["doctor"],
                    Date: recordData["date"],
                    Time: recordData["time"],
                    Firstname: recordData["name"],
                    Lastname: recordData["surname"],
                    Patronymic: recordData["patronymic"],
                    Phone: recordData["phone"],
                    Email: recordData["email"],
                }
            })
        }).then(resp => resp.json())

        if (resp.code === 400) {
            return showToast({
                data: {
                    title: "Ошибка",
                    description: `Не удалось записаться: ${resp.error}`,
                    type: "error"
                }
            })
        }

        if (resp.code !== 200) {
            return showToast({
                data: {
                    title: "Ошибка",
                    description: `Не удалось записаться: Произошла непредвиденная ошибка`,
                    type: "error"
                }
            })
        }

        showToast({
            data: {
                title: "Успех",
                description: `Запись успешно оформлена`,
                type: "success"
            }
        })
    }

    onMount(async () => {
        isLoading = true
        await GetSpecifiactions()
        await GetDoctors()
        await GetOffers()
        await PreloadData()
        isLoading = false
    })
</script>

<svelte:head>
    <title>MedPlus - Записаться на приём</title>
</svelte:head>

<div class="w-screen h-screen flex p-3">
    {#if isLoading}
        <Loading className="!w-32 mx-auto" palette="primary"/>
    {:else}
        <Card 
            className="w-[90%] max-w-3xl m-auto"
            partStyling={{
                body: {
                    class: "my-3"
                }
            }}
        >
            <svelte:fragment slot="header">
                <h2>Записаться на приём</h2>
            </svelte:fragment>
            <svelte:fragment slot="body">
                <div class="flex items-center flex-wrap gap-3 mb-2">
                    <Input className="max-w-[200px]" name="name" label="Фамилия" required bind:value={recordData["surname"]} />
                    <Input className="max-w-[200px]" name="name" label="Имя" required bind:value={recordData["name"]} />
                    <Input className="max-w-[200px]" name="name" label="Отчество" bind:value={recordData["patronymic"]} />
                </div>

                <div class="flex items-center flex-wrap gap-3 mb-2">
                    <Input className="max-w-[200px]" name="email" label="Почта" type="email" required bind:value={recordData["email"]} />
                    <Input className="max-w-[200px]" name="phone" label="Телефон" type="phone" required bind:value={recordData["phone"]} />
                </div>

                <div class="flex items-center flex-wrap gap-3 mb-2">
                    <Select className="max-w-xs" name="specification" label="Специальность" options={specifications} required bind:value={recordData["specification"]} />

                    {#if recordData["specification"]}
                        <Select className="max-w-xs" name="doctor" label="Врач" options={doctors.filter(v => v.specification == recordData["specification"])} valueKey="id" labelKey="fio" required bind:value={recordData["doctor"]} />
                    {/if}

                    {#if recordData["doctor"]}
                        <div class="w-full max-w-xs" transition:fade>
                            <Select name="offer" label="Услуга" options={offers} valueKey="id" labelKey="title" required bind:value={recordData["offer"]} />
                        </div>
                    {/if}

                    {#if recordData["offer"]}
                        <div class="w-full max-w-xs" transition:fade>
                            <DateInput label="Дата" required bind:value={recordData["date"]} />
                        </div>
                    {/if}
                </div>

                {#if recordData["date"]}
                    {#if timeIntervals.length == 0}
                        <p class="text-neutral-500" transition:fade>На выбранный день записей нет</p>
                    {/if}

                    <div class="flex items-center flex-wrap gap-3 mb-2" transition:fade>
                        {#each timeIntervals as time, idx (idx)}
                            <Button 
                                modifiers={{
                                    flat: true,
                                }} 
                                palette={recordData["time"] == time ? "primary" : "info"} 
                                onClick={() => recordData["time"] == time ? recordData["time"] = null : recordData["time"] = String(time)}
                            >
                                {time}
                            </Button>
                        {/each}
                    </div>
                {/if}

                {#if recordData["name"] && recordData["surname"] && recordData["email"] && recordData["phone"] && recordData["time"]}
                    <div class="ml-auto" transition:fade>
                        <Button onClick={Submit} className="ml-auto" palette="primary">Записаться</Button>
                    </div>
                {/if}
            </svelte:fragment>
        </Card>
    {/if}
</div>