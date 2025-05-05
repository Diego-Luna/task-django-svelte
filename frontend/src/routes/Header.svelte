<script lang="ts">
    import { page } from '$app/state';
    import { fade } from 'svelte/transition';
    import logo from '$lib/images/svelte-logo.svg';
    import LanguageSwitcher from '$lib/components/shared/LanguageSwitcher.svelte';
    import { language } from '$lib/stores/language';
    import { createTranslate } from '$lib/i18n/translations';
    import { auth } from '$lib/stores/auth';
    import { goto } from '$app/navigation';
    import { logout } from '../service/auth';
    
    $: t = createTranslate($language);
    $: isAuthenticated = $auth.isAuthenticated;
    $: user = $auth.user;
    
    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error', error);
        }
    }
</script>

<header class="bg-white shadow-md py-4 px-6 mb-8">
    <div class="container mx-auto flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
        <a href="/" class="flex items-center gap-2">
            <img src={logo} alt={t('appTitle')} class="w-8 h-8" />
            <span class="font-bold text-xl text-gray-800">{t('appTitle')}</span>
        </a>

        <div class="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
            <nav>
                <ul class="flex gap-6 items-center">
                    <li>
                        <a 
                            href="/tasks" 
                            class="font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 {page.url.pathname.startsWith('/tasks') ? 'text-blue-600 border-b-2 border-blue-600' : ''}"
                        >
                            {t('tasks')}
                        </a>
                    </li>
                    
                    {#if isAuthenticated && user}
                        <li transition:fade|local>
                            <a 
                                href="/auth/profile" 
                                class="font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 {page.url.pathname.startsWith('/auth/profile') ? 'text-blue-600 border-b-2 border-blue-600' : ''}"
                            >
                                {t('profile')}
                            </a>
                        </li>
                        <li transition:fade|local>
                            <div class="flex items-center gap-3">
                                <span class="text-sm text-gray-700 hidden md:inline">
                                    {user.username}
                                </span>
                                <button 
                                    on:click={handleLogout}
                                    class="font-medium text-red-600 hover:text-red-700 transition-colors duration-200"
                                >
                                    {t('logout')}
                                </button>
                            </div>
                        </li>
                    {:else}
                        <li transition:fade|local>
                            <a 
                                href="/auth/login" 
                                class="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 {page.url.pathname === '/auth/login' ? 'border-b-2 border-blue-600' : ''}"
                            >
                                {t('login')}
                            </a>
                        </li>
                        <li transition:fade|local>
                            <a 
                                href="/auth/register" 
                                class="font-medium bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200"
                            >
                                {t('register')}
                            </a>
                        </li>
                    {/if}
                </ul>
            </nav>
            
            <LanguageSwitcher />
        </div>
    </div>
</header>