<script lang="ts">
    import { goto } from '$app/navigation'

    import { fade } from 'svelte/transition'

	import Button from "$components/controllers/Button.svelte"
	import Avatar from "$components/data_displays/Avatar.svelte"
	import Dropdown from '$components/controllers/Dropdown.svelte'

    let toggleMenu: boolean = false

    export let data
</script>

<svelte:head>
    <title>Панель управления - {data.title}</title>
</svelte:head>

<div class="page">
    <div class="page__navigation" class:toggle={toggleMenu}>
        <div class="page__navigation__header">
            <div class="logo">
                <svg fill="var(--primary)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g stroke-width="0"></g>
                    <g stroke-linecap="round" stroke-linejoin="round"></g>
                    <g>
                        <path class="text-neutral-content" id="secondary" d="M22,4V7a2,2,0,0,1-2,2H15a2,2,0,0,1-2-2V4a2,2,0,0,1,2-2h5A2,2,0,0,1,22,4ZM9,15H4a2,2,0,0,0-2,2v3a2,2,0,0,0,2,2H9a2,2,0,0,0,2-2V17A2,2,0,0,0,9,15Z" style="fill: currentColor;"></path>
                        <path class="text-primary" id="primary" d="M11,4v7a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2H9A2,2,0,0,1,11,4Zm9,7H15a2,2,0,0,0-2,2v7a2,2,0,0,0,2,2h5a2,2,0,0,0,2-2V13A2,2,0,0,0,20,11Z" style="fill: currentColor;"></path>
                    </g>
                </svg>
            </div>
            {#if toggleMenu}
                <p class="text-sm" in:fade>Панель управления</p>
            {/if}
        </div>
        <div class="-right-6 top-0 absolute bg-neutral rounded-full p-2">
            <Button palette="primary" modifiers={{circle: 40}} onClick={() => toggleMenu = !toggleMenu}>
                {#if toggleMenu}
                    <i class="fa-solid fa-caret-left"></i>
                {:else}
                    <i class="fa-solid fa-bars"></i>
                {/if}
            </Button>
        </div>
        <div class="page__navigation__list">
            {#each data.links as link, idx (idx)}
                {@const url = `/dashboard/${link.href}`.replaceAll("//", "/")}
                <a class="page__navigation__list__link" href={url}>
                    <div class="icon">
                        <span class={link.icon ?? "fa-regular fa-circle"}></span>
                    </div>
                    {#if toggleMenu}
                        <span class="text-sm" in:fade>{link.title}</span>
                    {/if}
                </a>
            {/each}
        </div>
    </div>
    <div class="page__container">
        <div class="page__header">
            <div class="relative ml-auto">
                <Dropdown className="!p-0">
                    <svelte:fragment slot="trigger">
                        <Avatar title={data.user.login ?? ""}/>
                    </svelte:fragment>
                    <svelte:fragment slot="content">
                        <Button className="!text-base-content !p-2 hover:!bg-primary/10 hover:!text-primary" modifiers={{tranparent: true, flat: true}} onClick={() => goto("/dashboard/account")}>
                            <span class="fa-solid fa-user"></span>
                            <span>Профиль</span>
                        </Button>
                        <Button className="!text-base-content !p-2 hover:!bg-primary/10 hover:!text-primary" modifiers={{tranparent: true, flat: true}} onClick={() => goto("/default/home")}>
                            <i class="fa-solid fa-globe"></i>
                            <span>Основной модуль</span>
                        </Button>
                        <Button className="!text-base-content !p-2 hover:!bg-primary/10 hover:!text-primary" modifiers={{tranparent: true, flat: true}} onClick={() => goto("/dashboard/logout")}>
                            <span class="fa-solid fa-door-open"></span>
                            <span>Выход</span>
                        </Button>
                    </svelte:fragment>
                </Dropdown>
            </div>
        </div>
        <div class="page__content">
            <slot />
        </div>
    </div>
</div>

<style lang="postcss">
    .page {
        @apply flex flex-row w-screen h-screen overflow-hidden;

        &__navigation {
            --navigation-width: 200px;

            @apply bg-neutral text-neutral-content flex flex-col absolute top-0 bottom-0 md:relative z-20 w-20 h-full max-w-[var(--navigation-width)];

            transition-property: width;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 300ms;

            &__header {
                --logo-size: 40px;

                @apply flex items-center pl-2 py-2 pr-8 gap-2 h-14 overflow-hidden;

                & > .logo {
                    @apply w-full max-w-[var(--logo-size)] h-full max-h-[var(--logo-size)];

                    & > * {
                        @apply w-[var(--logo-size)] h-[var(--logo-size)];
                    }
                }
            }

            &__list {
                @apply flex flex-col items-center max-h-full overflow-x-hidden overflow-y-auto mt-4;

                &__link {
                    --icon-size: 25px;

                    @apply flex justify-center items-center px-2 py-3 gap-2 w-full overflow-hidden;

                    & > .icon {
                        @apply flex items-center justify-center w-full h-full max-w-[var(--icon-size)] max-h-[var(--icon-size)];
                    }

                    &:hover {
                        @apply bg-black/10;
                    }
                }
            }

            &.toggle {
                @apply w-[var(--navigation-width)];
            }

            &.toggle &__list__link {
                @apply justify-start;
            }
        }

        &__container {
            @apply flex flex-col h-full w-full pl-20 md:pl-0 z-10;
        }

        &__header {
            @apply flex flex-row items-center justify-between px-4 py-2 shadow-md w-full bg-base-100;
        }

        &__content {
            @apply flex flex-col w-full h-full p-4 bg-base-200 overflow-auto;
        }
    }
</style>