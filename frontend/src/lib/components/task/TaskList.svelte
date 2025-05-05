<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, slide, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import TaskItem from './TaskItem.svelte';
  import TaskForm from './TaskForm.svelte';
  import TaskFilter from './TaskFilter.svelte';
  import { fetchTasks, createTask, updateTask, deleteTask } from '../../../service/task';
  import type { Task, TaskFilter as FilterType } from '$lib/types';

  let tasks: Task[] = [];
  let isLoading = true;
  let error: string | null = null;
  let activeFilter: FilterType = 'all';
  
  let showForm = false;
  let editingTask: Partial<Task> | null = null;

  onMount(async () => {
    await loadTasks();
  });

  async function loadTasks() {
    isLoading = true;
    error = null;
    
    try {
      tasks = await fetchTasks(activeFilter);
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred while fetching tasks';
    } finally {
      isLoading = false;
    }
  }

  async function handleToggleStatus(event: CustomEvent<{ id: number, status: 'todo' | 'done' }>) {
    try {
      const { id, status } = event.detail;
      await updateTask(id, { status });
      await loadTasks();
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred while updating the task';
    }
  }

  async function handleEdit(event: CustomEvent<Task>) {
    editingTask = event.detail;
    showForm = true;
  }

  async function handleDelete(event: CustomEvent<number>) {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(event.detail);
        await loadTasks();
      } catch (err) {
        error = err instanceof Error ? err.message : 'An error occurred while deleting the task';
      }
    }
  }

  async function handleSave(event: CustomEvent<Partial<Task>>) {
    try {
      const taskData = event.detail;
      
      if (editingTask && 'id' in editingTask && editingTask.id) {
        // Update existing task
        await updateTask(editingTask.id, taskData);
      } else {
        // Create new task
        await createTask(taskData as any);
      }
      
      // Reset form state
      showForm = false;
      editingTask = null;
      
      // Reload tasks
      await loadTasks();
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred while saving the task';
    }
  }

  function handleFilterChange(event: CustomEvent<FilterType>) {
    activeFilter = event.detail;
    loadTasks();
  }
</script>

<div class="container mx-auto p-4 max-w-4xl" in:fade>
  <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h1 class="text-3xl font-bold text-gray-800">Task Manager</h1>
    
      <button 
          on:click={() => { editingTask = null; showForm = !showForm }}
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-2"
      >
          <span class="text-lg">
              {showForm ? '✕' : '+'}
          </span>
          {showForm ? 'Cancel' : 'Add Task'}
      </button>
  </div>
  
  {#if error}
      <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow" transition:slide>
          <div class="flex items-center">
              <span class="mr-2">⚠️</span>
              {error}
          </div>
      </div>
  {/if}

  {#if showForm}
      <div transition:slide={{duration: 300}}>
          <TaskForm 
              task={editingTask || {}} 
              isEditing={!!editingTask?.id} 
              on:save={handleSave} 
              on:cancel={() => { showForm = false; editingTask = null; }} 
          />
      </div>
  {/if}

  <TaskFilter activeFilter={activeFilter} on:filter={handleFilterChange} />

  {#if isLoading}
      <div class="flex justify-center py-12" in:fade>
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
  {:else if tasks.length === 0}
      <div class="bg-white p-8 text-center rounded-lg shadow-md border border-gray-100" in:fade>
          <p class="text-lg text-gray-600 mb-4">No tasks found.</p>
          <button 
              on:click={() => { editingTask = null; showForm = true }}
              class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition-colors"
          >
              Add your first task
          </button>
      </div>
  {:else}
      <div class="space-y-4 mt-6">
          {#each tasks as task (task.id)}
              <div animate:flip={{duration: 300}}>
                  <TaskItem 
                      {task} 
                      on:toggleStatus={handleToggleStatus} 
                      on:edit={handleEdit} 
                      on:delete={handleDelete}
                  />
              </div>
          {/each}
      </div>
  {/if}
</div>