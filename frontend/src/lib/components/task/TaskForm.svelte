<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Task } from '$lib/types';

  export let task: Partial<Task> = {
    title: '',
    description: '',
    status: 'todo'
  };
  export let isEditing = false;

  const dispatch = createEventDispatcher<{
    save: Partial<Task>;
    cancel: void;
  }>();

  function handleSubmit() {
    if (!task.title?.trim()) return;
    
    dispatch('save', {
      ...task,
      title: task.title.trim(),
      description: task.description?.trim() || null
    });
  }

  function handleCancel() {
    dispatch('cancel');
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
  <h2 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
    {isEditing ? 'Edit Task' : 'Add New Task'}
  </h2>
  
  <div class="mb-4">
    <label for="title" class="block text-gray-700 font-medium mb-1">Title</label>
    <input
      type="text"
      id="title"
      bind:value={task.title}
      required
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      placeholder="Enter task title"
    />
  </div>
  
  <div class="mb-4">
    <label for="description" class="block text-gray-700 font-medium mb-1">Description (optional)</label>
    <textarea
      id="description"
      bind:value={task.description}
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      rows="3"
      placeholder="Enter task description"
    ></textarea>
  </div>
  
  <div class="mb-6">
    <label for="status" class="block text-gray-700 font-medium mb-1">Status</label>
    <select
      id="status"
      bind:value={task.status}
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      <option value="todo">To Do</option>
      <option value="done">Done</option>
    </select>
  </div>
  
  <div class="flex justify-end space-x-2">
    <button
      type="button"
      on:click={handleCancel}
      class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
    >
      Cancel
    </button>
    <button
      type="submit"
      class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      {isEditing ? 'Update' : 'Add'} Task
    </button>
  </div>
</form>