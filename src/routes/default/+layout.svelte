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
    <title>MedPlus - {data.title}</title>
</svelte:head>

<div class="page">
    <div class="page__navigation" class:toggle={toggleMenu}>
        <div class="page__navigation__header">
            <div class="logo">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <g stroke-width="0"></g>
                    <g stroke-linecap="round" stroke-linejoin="round"></g>
                    <g> 
                        <defs> 
                            <style>.cls-1{fill:rgb(var(--primary-fg))}.cls-2{fill:rgb(var(--primary))}</style> 
                        </defs> 
                        <g> 
                            <path class="cls-1" d="M27.31,7.54a8,8,0,0,0-5.64-2.3h-.09A8,8,0,0,0,16,7.58a8.2,8.2,0,0,0-5.71-2.26,8.17,8.17,0,0,0-5.62,14l.43.39a1.07,1.07,0,0,0,.14.16l10.22,10a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.3l10-10.23a1.06,1.06,0,0,0,.24-.39l.32-.31a8.08,8.08,0,0,0-.12-11.39Z"></path> 
                            <path class="cls-2" d="M29,15.13,18.26,15h0a1,1,0,0,0-.92.61L17,14.28a1,1,0,0,0-.61-.67,1,1,0,0,0-.91.11l-1.26.85-1.4-4a1,1,0,0,0-.8-.66,1,1,0,0,0-1,.4L7.57,15,3,15.13a1,1,0,0,0,.06,2L8.11,17a1,1,0,0,0,.78-.41L11.52,13l1.2,3.45a1,1,0,0,0,.63.62,1,1,0,0,0,.88-.12l1.18-.8.79,2.9a1,1,0,0,0,.92.74h.05a1,1,0,0,0,.93-.64L18.93,17,29,17.13h0a1,1,0,0,0,0-2Z"></path> 
                        </g> 
                    </g>
                </svg>
            </div>
            {#if toggleMenu}
                <p class="text-sm" in:fade>Med+</p>
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
                {@const url = `/default/${link.href}`.replaceAll("//", "/")}
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
                        {#if data.user.role.type == "admin"}
                            <Button className="!text-base-content !p-2 hover:!bg-primary/10 hover:!text-primary" modifiers={{tranparent: true, flat: true}} onClick={() => goto("/dashboard/home")}>
                                <span class="fa-solid fa-gauge-high"></span>
                                <span>Панель управления</span>
                            </Button>
                        {/if}
                        {#if data.user.role.type != "admin"}
                            <Button className="!text-base-content !p-2 hover:!bg-primary/10 hover:!text-primary" modifiers={{tranparent: true, flat: true}} onClick={() => goto("/default/account")}>
                                <span class="fa-solid fa-user"></span>
                                <span>Профиль</span>
                            </Button>
                        {/if}
                        <Button className="!text-base-content !p-2 hover:!bg-primary/10 hover:!text-primary" modifiers={{tranparent: true, flat: true}} onClick={() => goto("/default/logout")}>
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