<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import UserProfile from '$lib/components/auth/UserProfile.svelte';
    import { language } from '$lib/stores/language';
    import { createTranslate } from '$lib/i18n/translations';
    import { auth } from '$lib/stores/auth';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    
    $: t = createTranslate($language);
    $: isAuthenticated = $auth.isAuthenticated;
    
    // Protección de ruta - redirigir si no está autenticado
    onMount(() => {
        if (browser && !isAuthenticated) {
            goto('/auth/login?redirectTo=/auth/profile');
        }
    });
</script>

<svelte:head>
    <title>{t('profile')} - {t('appTitle')}</title>
    <meta name="description" content={$language === 'fr' ? 'Votre profil d\'utilisateur' : 'Your user profile'} />
</svelte:head>

<div in:fade={{duration: 300}}>
    <UserProfile />
</div>