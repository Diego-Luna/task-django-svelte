<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { page } from '$app/state';
    import Header from './Header.svelte';
    import '../app.css';
    import { language } from '$lib/stores/language';
    import { createTranslate } from '$lib/i18n/translations';
    
    $: t = createTranslate($language);
</script>

<div class="flex flex-col min-h-screen bg-gray-50">
    <Header />
    
    <main class="flex-1 container mx-auto p-4 md:p-6" in:fade={{ duration: 250, delay: 300 }}>
        <slot />
    </main>
    
    <footer class="bg-gray-800 text-white p-4 text-center">
        <p class="text-sm">
            {t('appTitle')} - Powered by <a href="https://svelte.dev" class="text-blue-300 hover:text-blue-200 underline">Svelte</a> and <a href="https://www.djangoproject.com/" class="text-green-300 hover:text-green-200 underline">Django</a>
        </p>
    </footer>
</div>