<script lang="ts">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'

    import Card from '$components/containers/Card.svelte'
	import Avatar from '$components/data_displays/Avatar.svelte'
    import Input from '$components/inputs/Input.svelte'
	import Button from '$components/controllers/Button.svelte'
	import { showToast } from '$components/feedback/Toast.svelte'

    let login: string = ""
    let firstName: string = ""
    let lastName: string = ""
    let patronymic: string = ""
    let oldPass: string = ""
    let newPass: string = ""

    let loginError: string | null = null
    let firstNameError: string | null = null
    let lastNameError: string | null = null
    let patronymicError: string | null = null
    let oldError: string | null = null
    let newError: string | null = null

    const ChangeData = async function() {
        const resp = await fetch("/api/account/", {
            method: "POST",
            body: JSON.stringify({
                data: {
                    login: login,
                    firstName: firstName,
                    lastName: lastName,
                    patronymic: patronymic
                }
            })
        }).then(resp => resp.json())

        if (resp.code == 400) {
            if (typeof resp.error == "object") {
                loginError = resp.error.login ?? null
                firstNameError = resp.error.firstName ?? null
                lastNameError = resp.error.lastName ?? null
                patronymicError = resp.error.patronymic ?? null

                return
            }
            
            showToast({
                data: {
                    title: "Ошибка",
                    description: resp.error,
                    type: "error",
                }
            })
        }

        if (resp.code !== 200) {
            showToast({
                data: {
                    title: "Ошибка",
                    description: "Не удалось изменить данные из-за непредвиденной ошибки, повторите попутку позже!",
                    type: "error",
                }
            })

            return
        }

        loginError = null
        firstNameError = null
        lastNameError = null
        patronymicError = null

        login = resp.data.login
        firstName = resp.data.firstName
        lastName = resp.data.lastName
        patronymic = resp.data.patronymic

        data.user.login = resp.data.login
        data.user.firstName = resp.data.firstName
        data.user.lastName = resp.data.lastName
        data.user.patronymic = resp.data.patronymic

        showToast({
            data: {
                title: "Успех",
                description: "Данные успешно изменены",
                type: "success",
            }
        })
    }

    const ChangePass = async function() {
        const resp = await fetch("/api/account/change_password", {
            method: "POST",
            body: JSON.stringify({
                data: {
                    old: oldPass,
                    new: newPass,
                }
            })
        }).then(resp => resp.json())

        if (resp.code == 400) {
            if (typeof resp.error == "object") {
                oldError = resp.error.old ?? null
                newError = resp.error.new ?? null

                return
            }
            
            showToast({
                data: {
                    title: "Ошибка",
                    description: resp.error,
                    type: "error",
                }
            })
        }

        oldError = null
        newError = null
        oldPass = ""
        newPass = ""

        showToast({
            data: {
                title: "Успех",
                description: "Пароль успешно изменён",
                type: "success",
            }
        })
    }
	
    export let data

    onMount(() => {
        login = data.user.login ?? ""
        firstName = data.user.firstName ?? ""
        lastName = data.user.lastName ?? ""
        patronymic = data.user.patronymic ?? ""
    })
</script>

<h2>Профиль</h2>

<Card 
className="!p-0 mt-5 !rounded-none"
partStyling={{
    header: {
        class: "w-full h-40 relative bg-neutral text-neutral-content",
    },
    body: {
        class: "py-5 px-3"
    }
}}>
    <svelte:fragment slot="header">
        <div class="absolute left-4 -bottom-6 flex items-start gap-3">
            <div class="rounded-sm bg-base-100 p-1 flex items-center justify-center">
                <Avatar className="!w-20 !h-20 md:!w-28 md:!h-28 !rounded-sm" title={data.user.login ?? ""} />
            </div>
            <div class="flex flex-col justify-end self-stretch pb-12">
                <p class="font-semibold text-lg">{data.user.firstName ?? ""} {data.user.lastName ?? ""} {data.user.patronymic ?? ""} ({data.user.login})</p>
                <p class="text-xs text-info">{data.user.role.title}</p>
            </div>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="body">
        <p class="text-xl font-bold">Изменить персональные данные</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 ml-5">
            <Input label="Логин" className="max-w-sm" name="login" error={loginError} bind:value={login} />
            <Input label="Имя" className="max-w-sm" name="first_name" error={firstNameError} bind:value={firstName} />
            <Input label="Фамилия" className="max-w-sm" name="last_name" error={lastNameError} bind:value={lastName} />
            <Input label="Отчество" className="max-w-sm" name="patronymic" error={patronymicError} bind:value={patronymic} />
            <Button className="mr-auto" palette="primary" onClick={ChangeData}>Изменить</Button>
        </div>
        <p class="text-xl font-bold">Изменить пароль</p>
        <div class="flex flex-col gap-3 ml-5">
            <Input label="Старый пароль" className="max-w-sm" name="old_pass" type="password" error={oldError} bind:value={oldPass}/>
            <Input label="Новый пароль" className="max-w-sm" name="new_pass" type="password" error={newError} bind:value={newPass}/>
            {#if oldPass != "" && newPass != ""}
                <div transition:fade>
                    <Button className="mr-auto" palette="primary" onClick={ChangePass}>Изменить</Button>
                </div>
            {/if}
        </div>
    </svelte:fragment>
</Card>