<svelte:head>
    <title>MedPlus - Авторизация</title>
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
            const resp = await fetch("/api/auth", {
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

            goto("/default/home")
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
            className="mx-auto w-[95%] min-h-80 max-w-3xl"
        >
            <svelte:fragment slot="side">
                <style type="text/css"> 
                    .isometric_vijf{fill: rgb(var(--primary-fg))} 
                    .isometric_acht{fill: rgb(var(--primary-fg))}
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
                </style> 
                <svg class="w-32 absolute -top-2 -left-2 -rotate-12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" fill="#000000">
                    <g stroke-width="0"></g>
                    <g stroke-linecap="round" stroke-linejoin="round"></g>
                    <g> 
                        <g> 
                            <path class="isometric_tien" d="M19.687,8.182v1.076h-0.02c-0.248,2.63-7.05,2.634-7.355,0l0,0V8.196 c-1.641,0.725-2.395,1.803-2.306,2.865H10v12.706c0-0.001,0.003-0.003,0.003-0.004C9.983,28.342,22.025,28.379,22,23.805V11.061 h-0.001C22.034,10.109,21.349,9.088,19.687,8.182z"></path> 
                            <path class="isometric_zeven" d="M18.616,7.639c-1.436,0.829-3.77,0.825-5.215-0.009s-1.452-2.182-0.016-3.011 s3.77-0.825,5.215,0.009S20.051,6.81,18.616,7.639z M22,11.061v9.547c0.025,4.574-12.017,4.537-11.997-0.041 c0,0.001-0.003,0.003-0.003,0.004v-9.509h0.026c0.068,0.835,0.637,1.662,1.745,2.302c2.35,1.357,6.149,1.364,8.485,0.015 c1.111-0.641,1.673-1.474,1.723-2.317H22z M20,16.695c-0.599,0.309-1.282,0.526-2,0.671v-2.185c-0.967,0.194-1.997,0.246-3,0.145 v2.182c-0.693-0.07-1.373-0.204-2-0.416v3.167c0.628,0.213,1.306,0.354,2,0.428v1.716c0.337,0.034,0.678,0.058,1.019,0.058 c0.673,0.001,1.34-0.074,1.981-0.203v-1.712c0.719-0.148,1.4-0.373,2-0.683V16.695z"></path>
                            <path class="isometric_acht" d="M19.687,6.136v3.122h-0.02c-0.248,2.63-7.05,2.634-7.355,0V6.129h0.001 c0.006,0.543,0.368,1.085,1.088,1.501c1.445,0.834,3.779,0.838,5.215,0.009C19.333,7.225,19.69,6.68,19.687,6.136z M18.416,5.601 c-0.002-0.003-0.006-0.006-0.008-0.009c-0.852-1.257-3.963-1.257-4.815,0c-0.002,0.003-0.006,0.006-0.008,0.009 c0,0-0.279,0.37-0.124,0.825c0.105-0.311,0.424-0.605,0.449-0.589c1.08-0.842,3.261-0.792,4.186-0.002 c0.227,0.179,0.375,0.382,0.446,0.591C18.694,5.97,18.416,5.601,18.416,5.601z M18,15.182c-0.967,0.194-1.997,0.246-3,0.145v2.182 c-0.693-0.07-1.373-0.204-2-0.416v3.167c0.628,0.213,1.306,0.354,2,0.428v1.716c0.337,0.034,0.678,0.058,1.019,0.058 c0.673,0.001,1.34-0.074,1.981-0.203v-1.712c0.719-0.148,1.4-0.373,2-0.683v-3.167c-0.599,0.309-1.282,0.526-2,0.671V15.182z"></path> 
                        </g> 
                    </g>
                </svg>
                <svg class="w-28 absolute bottom-3 right-3 rotate-12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" fill="#000000">
                    <g stroke-width="0"></g>
                    <g stroke-linecap="round" stroke-linejoin="round"></g>
                    <g> 
                        <g> 
                            <path class="isometric_twaalf" d="M19.671,4.987h-0.01c-0.055-0.495-0.403-0.98-1.059-1.36c-1.435-0.828-3.753-0.832-5.179-0.009 c-0.709,0.409-1.05,0.946-1.048,1.484h-0.006v1.61c-0.008,2.731,7.196,2.817,7.295,0.076C19.673,5.559,19.671,5.996,19.671,4.987z"></path> 
                            <path class="isometric_tien" d="M7.535,27.843c-3.664-2.116-4.476-5.244-2.453-7.8l8.372-10.372v-1.43c0,0,0.001,0,0.001,0 c1.358,0.723,3.673,0.751,5.061,0.058c0.014-0.005,0.022-0.008,0.022-0.011l0,0v1.004l8.408,10.877 c0.664,0.868,1.016,1.796,1.039,2.727C28.139,29.183,15.019,32.164,7.535,27.843z M18.61,6.606 c-1.421,0.821-3.733,0.816-5.164-0.009c-1.43-0.826-1.438-2.161-0.016-2.981s3.733-0.817,5.164,0.009 C20.024,4.451,20.031,5.786,18.61,6.606z M17.511,4.25c-0.829-0.478-2.168-0.481-2.992-0.005C13.696,4.72,13.7,5.494,14.529,5.972 c0.094,0.055,0.25,0.123,0.224,0.112c0.257-0.705,0.833-1.255,1.555-1.474c0.879,0.064,1.557,0.447,1.557,0.915 c0,0.092-0.027,0.181-0.076,0.264C18.33,5.315,18.237,4.669,17.511,4.25z"></path> 
                            <path class="isometric_zeven" d="M25.49,22.294c-0.018-0.738-0.297-1.472-0.823-2.16l-3.302-4.282c-0.351-0.52-0.937-1-1.764-1.384 c-2.309-1.074-5.47-1.056-7.695,0.229c-0.703,0.406-1.186,0.908-1.44,1.446l-3.112,3.891c-1.602,2.025-0.959,4.502,1.943,6.178 C15.234,29.641,25.612,27.269,25.49,22.294z"></path> 
                            <path class="isometric_dertien" d="M21.624,24.592l0.421,0.93c-1.398,0.626-3.044,1.018-4.796,1.14v-1.02 C18.859,25.522,20.352,25.163,21.624,24.592z M17.27,24.209c1.363-0.129,2.656-0.421,3.816-0.856l-0.443-0.918 c-1.035,0.38-2.182,0.633-3.399,0.754L17.27,24.209z M17.24,20.81l0.031,1.02c1.006-0.101,1.973-0.291,2.877-0.56l-0.447-0.914 C18.926,20.576,18.098,20.72,17.24,20.81z"></path> 
                            <path class="isometric_vijf" d="M11.93,19.412c2.224,1.284,5.385,1.33,7.698,0.257c2.81-1.303,2.888-3.844-0.028-5.2 c-2.309-1.074-5.47-1.056-7.695,0.229C9.745,15.944,9.656,18.099,11.93,19.412C14.192,20.717,10.388,18.521,11.93,19.412z"></path> 
                        </g> 
                    </g>
                </svg>
            </svelte:fragment>
            <svelte:fragment slot="header">
                <h2>Добро пожаловать в модуль Med+</h2>
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