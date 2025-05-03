<script lang="ts">
    import { goto } from '$app/navigation';
</script>

<svelte:head>
    <title>Task Manager</title>
    <meta name="description" content="Task Management Application" />
</svelte:head>

<div class="container mx-auto p-4 max-w-4xl min-h-screen flex flex-col justify-center items-center">
    <div class="text-center">
        <h1 class="text-5xl font-bold mb-6 text-blue-600">Task Manager</h1>
        <p class="text-xl mb-8 text-gray-600">Efficiently manage your tasks with our easy-to-use task management application.</p>
        
        <div class="space-y-4">
            <button 
                class="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg shadow-lg transition-all"
                on:click={() => goto('/tasks')}
            >
                Get Started
            </button>
        </div>
    </div>
    
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-blue-500 text-4xl mb-4">✓</div>
            <h2 class="text-xl font-bold mb-2">Create Tasks</h2>
            <p class="text-gray-600">Easily create new tasks with titles, descriptions, and status.</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-blue-500 text-4xl mb-4">⟳</div>
            <h2 class="text-xl font-bold mb-2">Update Status</h2>
            <p class="text-gray-600">Mark tasks as complete or reopen them with a single click.</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-blue-500 text-4xl mb-4">⚙</div>
            <h2 class="text-xl font-bold mb-2">Filter Tasks</h2>
            <p class="text-gray-600">Filter tasks by status to focus on what matters.</p>
        </div>
    </div>
</div>