<script lang="ts">
    import { goto } from '$app/navigation';
    import { fly } from 'svelte/transition';
    import TaskList from '$lib/components/task/TaskList.svelte';
</script>

<svelte:head>
    <title>Task Manager</title>
    <meta name="description" content="Efficient task management application" />
</svelte:head>

<div in:fly={{ y: 20, duration: 500 }} class="mb-6">
    <TaskList />
</div>