<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import RegisterForm from '$lib/components/auth/RegisterForm.svelte';
    import { language } from '$lib/stores/language';
    import { createTranslate } from '$lib/i18n/translations';
    import { auth } from '$lib/stores/auth';
    import { goto } from '$app/navigation';
    
    $: t = createTranslate($language);
    $: isAuthenticated = $auth.isAuthenticated;
    
    // Redirigir si ya está autenticado
    onMount(() => {
        if (isAuthenticated) {
            goto('/');
        }
    });
</script>

<svelte:head>
    <title>{t('register')} - {t('appTitle')}</title>
    <meta name="description" content={$language === 'fr' ? 'Créez un nouveau compte' : 'Create a new account'} />
</svelte:head>

<div in:fade={{duration: 300}}>
    <RegisterForm />
</div>