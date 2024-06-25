<svelte:head>
    <title>Панель управления - Авторизация</title>
</svelte:head>

<script lang="ts">
    import { goto } from '$app/navigation'

	import Card from "$components/containers/Card.svelte"
    import Input from "$components/inputs/Input.svelte"
	import Button from "$components/controllers/Button.svelte"

    import { showToast } from "$components/feedback/Toast.svelte"

    let form = {
        login: "",
        password: "",
        submit: async () => {
            const resp = await fetch("/api/dashboard/users/auth", {
                method: "POST",
                body: JSON.stringify({
                    data: form
                }),
            }).then(resp => resp.json()) as Record<string, any>

            if (resp.code != 200) {
                showToast({
                    data: {
                        title: "Ошибка",
                        description: resp.error ?? "Возникла внутренняя ошибка сервера! Повторите попытку позже.",
                        type: "error",
                    },
                })
            }

            goto("/dashboard/home")
        }
    }
</script>

<div class="full-screen">
    <form on:submit|preventDefault={form.submit}>
        <Card 
            partStyling={{
                side: {
                    class: "w-72 hidden md:flex"
                },
                body: {
                    class: "mt-5"
                },
                footer: {
                    class: "mt-5"
                }
            }} 
            className="mx-auto w-[95%] max-w-3xl"
        >
            <svelte:fragment slot="side">
                <style type="text/css"> 
                    .isometric_vijf{fill: rgb(var(--primary-fg))} 
                    .isometric_een{fill:#F8F7C5;}
                    .isometric_acht{fill: rgb(var(--primary-fg))}
                    .isometric_negen{fill: rgb(var(--primary))}
                    .isometric_elf{fill:#72C0AB;}
                    .isometric_zeven{fill: rgb(var(--primary))} 
                    .isometric_tien{fill:#7BD6C4;} 
                    .isometric_twaalf{fill:#569080;} 
                    .isometric_dertien{fill: rgb(var(--primary-fg))} 
                    .st0{fill:#F28103;} 
                    .st1{fill:#72C0AB;} 
                    .st2{fill:#BE1E2D;} 
                    .st3{fill:#F05A28;} 
                    .st4{fill:#F8F7C5;} 
                    .st5{fill:#F29227;} 
                    .st6{fill:#F5DF89;} 
                    .st7{fill:#AD9A74;} 
                    .st8{fill:none;} 
                    .st9{fill:#F2D76C;} 
                    .st10{fill:#7BD6C4;} 
                    .st11{fill:#569080;} 
                    .st12{fill:#569080;}
                </style>
                <svg class="w-32 absolute top-3 right-3 rotate-12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" fill="#000000">
                    <g stroke-width="0"></g>
                    <g stroke-linecap="round" stroke-linejoin="round"></g>
                    <g> 
                        <g> 
                            <path class="isometric_acht" d="M20.995,15.479c0.024-0.712-0.452-1.438-1.488-1.978v-1.321c1.201-0.619,1.548-1.395,1.488-2.054 V8.606c-0.004-0.668-0.442-1.337-1.315-1.839c-1.767-1.018-4.623-1.023-6.379-0.012c-1.426,0.821-1.295,1.835-1.295,1.835v1.535 c-0.045,0.645,0.3,1.414,1.488,2.033c0,0,0,1.431,0,1.321c-1.038,0.535-1.513,1.259-1.488,1.971v1.489 c-0.049,0.702,0.381,1.414,1.315,1.952c1.767,1.018,4.623,1.023,6.379,0.012c0.935-0.539,1.36-1.256,1.295-1.964V15.479z"></path>
                            <path class="isometric_negen" d="M20.995,15.421v1.519c0.065,0.707-0.36,1.425-1.295,1.964c-1.756,1.011-4.612,1.006-6.379-0.012 c-0.934-0.538-1.364-1.25-1.315-1.952v-1.535c0.004,0.665,0.432,1.331,1.315,1.839c1.767,1.018,4.623,1.023,6.379,0.012 C20.578,16.75,20.998,16.086,20.995,15.421z M20.995,8.606c0.013,2.387-5.004,3.362-7.675,1.823 c-0.883-0.509-1.311-1.175-1.315-1.839v1.535l0,0c-0.045,0.645,0.3,1.414,1.488,2.033v1.782h0.006 c-0.015,0.456,0.275,0.916,0.881,1.265c1.178,0.679,3.082,0.682,4.253,0.008c0.607-0.35,0.891-0.813,0.866-1.273h0.009v-1.761 c1.201-0.619,1.548-1.395,1.488-2.054l0,0V8.606z"></path>
                            <path class="isometric_elf" d="M15.5,19.583v5.537h0.002c0,0,0.997,1.878,0.998,1.88c0.001-0.001,0.999-1.88,1-1.88v-2.828 c-0.389-1.005-0.881-1.905-1.463-2.661C15.857,19.62,15.678,19.607,15.5,19.583z"></path> 
                            <path class="isometric_twaalf" d="M16.037,19.631c0.582,0.755,1.074,1.656,1.463,2.661v-2.701 C17.019,19.652,16.527,19.662,16.037,19.631z"></path> 
                        </g> 
                    </g>
                </svg>
                <svg class="w-32 absolute bottom-3 -left-3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" fill="#000000">
                    <g stroke-width="0"></g>
                    <g stroke-linecap="round" stroke-linejoin="round"></g>
                    <g> 
                        <g> 
                            <polygon class="isometric_een" points="19.06,15.841 12.211,10.457 17.072,6.635 23.921,12.019 "></polygon> 
                            <polygon class="isometric_negen" points="26,17.177 26,13.645 15.069,22.254 15.073,25.782 "></polygon> 
                            <polygon class="isometric_twaalf" points="15.9,18.125 9.051,12.74 6.134,14.912 6.145,18.763 12.994,24.148 12.994,20.61 15.9,18.326 "></polygon> 
                            <polygon class="isometric_elf" points="12.983,20.418 6.134,14.912 9.051,12.74 15.9,18.125 "></polygon> 
                            <polygon class="isometric_acht" points="26,13.645 23.921,12.019 19.06,15.841 12.211,10.457 17.072,6.635 14.993,5 6,12.071 6,12.067 6,15.654 6.145,18.763 6.135,14.912 9.051,12.74 15.9,18.125 15.9,18.326 12.994,20.61 12.994,24.148 15.073,25.782 15.069,22.254 "></polygon> 
                        </g> 
                    </g>
                </svg>
            </svelte:fragment>
            <svelte:fragment slot="header">
                <h2>Добро пожаловать в панель управления</h2>
                <p class="text-neutral-400 text-lg">Войдите в свою учётную запись, чтобы продолжить</p>
            </svelte:fragment>
    
            <svelte:fragment slot="body">
                <Input className="max-w-xs" name="login" placeholder="Логин" icon="fa-solid fa-user text-black/30" bind:value={form.login}/>
                <Input className="max-w-xs" name="password" type="password" placeholder="Пароль" icon="fa-solid fa-key text-black/30" bind:value={form.password}/>
            </svelte:fragment>
            
            <svelte:fragment slot="footer">
                <Button palette="primary" type="submit">Войти</Button>
            </svelte:fragment>
        </Card>
    </form>
</div>