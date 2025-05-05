<script lang="ts">
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import LoginForm from '$lib/components/auth/LoginForm.svelte';
    import { language } from '$lib/stores/language';
    import { createTranslate } from '$lib/i18n/translations';
    import { auth } from '$lib/stores/auth';
    import { goto } from '$app/navigation';
    
    $: t = createTranslate($language);
    $: isAuthenticated = $auth.isAuthenticated;
    
    // Obtener queryParam redirectTo si existe
    const redirectTo = $page.url.searchParams.get('redirectTo') || '/';
    
    // Redirigir si ya está autenticado
    onMount(() => {
        if (isAuthenticated) {
            goto(redirectTo);
        }
    });
</script>

<svelte:head>
    <title>{t('login')} - {t('appTitle')}</title>
    <meta name="description" content={$language === 'fr' ? 'Connectez-vous à votre compte' : 'Log in to your account'} />
</svelte:head>

<div in:fade={{duration: 300}}>
    <LoginForm {redirectTo} />
</div>