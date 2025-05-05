<script lang="ts">
    import { page } from '$app/state';
    import logo from '$lib/images/svelte-logo.svg';
    import LanguageSwitcher from '$lib/components/shared/LanguageSwitcher.svelte';
    import { language } from '$lib/stores/language';
    import { translations, createTranslate } from '$lib/i18n/translations';
    
    $: t = createTranslate($language);
</script>

<header class="bg-white shadow-md py-4 px-6 mb-8">
    <div class="container mx-auto flex justify-between items-center">
        <a href="/" class="flex items-center gap-2">
            <img src={logo} alt={t('appTitle')} class="w-8 h-8" />
            <span class="font-bold text-xl text-gray-800">{t('appTitle')}</span>
        </a>

        <div class="flex items-center gap-6">
            <nav>
                <ul class="flex gap-6">
                    <li>
                        <a 
                            href="/tasks" 
                            class="font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 {page.url.pathname.startsWith('/tasks') ? 'text-blue-600 border-b-2 border-blue-600' : ''}"
                        >
                            {t('tasks')}
                        </a>
                    </li>
                </ul>
            </nav>
            
            <LanguageSwitcher />
        </div>
    </div>
</header>