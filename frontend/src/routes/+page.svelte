<script lang="ts">
    import { goto } from '$app/navigation';
    import { fly } from 'svelte/transition';
    import TaskList from '$lib/components/task/TaskList.svelte';
    import { language } from '$lib/stores/language';
    import { createTranslate } from '$lib/i18n/translations';
    
    $: t = createTranslate($language);
</script>

<svelte:head>
    <title>{t('appTitle')}</title>
    <meta name="description" content={$language === 'fr' ? 'Application de gestion de tâches efficace' : 'Efficient task management application'} />
</svelte:head>

<div in:fly={{ y: 20, duration: 500 }} class="mb-6">
    <TaskList />
</div>