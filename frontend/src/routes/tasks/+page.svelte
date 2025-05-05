<script lang="ts">
    import TaskList from '$lib/components/task/TaskList.svelte';
    import { language } from '$lib/stores/language';
    import { createTranslate } from '$lib/i18n/translations';
    
    $: t = createTranslate($language);
</script>

<svelte:head>
    <title>{t('appTitle')}</title>
    <meta name="description" content={$language === 'fr' ? 'Gérez vos tâches efficacement' : 'Manage your tasks efficiently'} />
</svelte:head>

<TaskList />