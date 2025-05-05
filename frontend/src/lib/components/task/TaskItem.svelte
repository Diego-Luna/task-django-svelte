<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { Task } from '$lib/types';

  export let task: Task;
  
  const dispatch = createEventDispatcher<{
    toggleStatus: { id: number, status: 'todo' | 'done' };
    edit: Task;
    delete: number;
  }>();

  function toggleStatus() {
    const newStatus = task.status === 'todo' ? 'done' : 'todo';
    dispatch('toggleStatus', { id: task.id ?? 0, status: newStatus });
  }

  function handleEdit() {
    dispatch('edit', task);
  }

  function handleDelete() {
    dispatch('delete', task.id ?? 0);
  }

  // Format date for better display
  function formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }
</script>

<div 
  class="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 mb-4 border-l-4 {task.status === 'done' ? 'border-green-500' : 'border-yellow-500'}"
  in:fade={{duration: 200}}
>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div class="flex-1 min-w-0">
      <h3 class="text-lg font-medium {task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-800'}">
        {task.title}
      </h3>
      {#if task.description}
        <p class="text-gray-600 mt-1 {task.status === 'done' ? 'line-through' : ''}">
          {task.description}
        </p>
      {/if}
      <p class="text-xs text-gray-500 mt-2">
        Created: {formatDate(task.created_at)}
      </p>
    </div>
    
    <div class="flex flex-wrap gap-2">
      <button 
        on:click={toggleStatus}
        class="{task.status === 'todo' 
          ? 'bg-green-500 hover:bg-green-600' 
          : 'bg-yellow-500 hover:bg-yellow-600'} 
          text-white px-3 py-1 rounded-md text-sm transition-all hover:shadow-md flex items-center gap-1"
      >
        <span class="text-sm">
          {task.status === 'todo' ? '✓' : '↻'}
        </span>
        {task.status === 'todo' ? 'Complete' : 'Reopen'}
      </button>
      
      <button 
        on:click={handleEdit}
        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-all hover:shadow-md"
      >
        Edit
      </button>
      
      <button 
        on:click={handleDelete}
        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-all hover:shadow-md"
      >
        Delete
      </button>
    </div>
  </div>
</div>