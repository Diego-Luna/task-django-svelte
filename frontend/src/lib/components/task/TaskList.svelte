<script lang="ts">
  import SecurityAlert from './SecurityAlert.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { fade, slide, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import TaskItem from './TaskItem.svelte';
  import TaskForm from './TaskForm.svelte';
  import TaskFilter from './TaskFilter.svelte';
  import { fetchTasks, createTask, updateTask, deleteTask } from '../../../service/task';
  import type { Task, TaskFilter as FilterType } from '$lib/types/types';
  import { language } from '$lib/stores/language';
  import { createTranslate } from '$lib/i18n/translations';
  import { auth } from '$lib/stores/auth';

  let tasks: Task[] = [];
  let isLoading = true;
  let error: string | null = null;
  let activeFilter: FilterType = 'all';
  
  let showForm = false;
  let editingTask: Partial<Task> | null = null;
  
  // Almacena la última autenticación conocida para compararla
  let previousAuthState = { isAuthenticated: $auth.isAuthenticated, userId: $auth.user?.id };
  
  $: t = createTranslate($language);
  $: isAuthenticated = $auth.isAuthenticated;
  
  // Añadir un efecto para recargar tareas cuando cambie la autenticación
  $: if ($auth.isAuthenticated !== previousAuthState.isAuthenticated || 
         $auth.user?.id !== previousAuthState.userId) {
    // Actualizar el estado anterior
    previousAuthState = { 
      isAuthenticated: $auth.isAuthenticated, 
      userId: $auth.user?.id 
    };
    
    // Recargar tareas cuando cambia la autenticación
    if (tasks.length > 0) {
      console.log("Autenticación cambió, recargando tareas...");
      loadTasks();
    }
  }

  onMount(async () => {
    await loadTasks();
  });

  async function loadTasks() {
    isLoading = true;
    error = null;
    
    try {
      tasks = await fetchTasks(activeFilter);
    } catch (err) {
      error = err instanceof Error ? err.message : t('error');
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
      error = err instanceof Error ? err.message : `${t('error')} ${t('update')}`;
    }
  }

  async function handleEdit(event: CustomEvent<Task>) {
    editingTask = event.detail;
    showForm = true;
  }

  async function handleDelete(event: CustomEvent<number>) {
    if (confirm(t('confirmDelete'))) {
      try {
        await deleteTask(event.detail);
        await loadTasks();
      } catch (err) {
        error = err instanceof Error ? err.message : `${t('error')} ${t('delete')}`;
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
      error = err instanceof Error ? err.message : `${t('error')}`;
    }
  }

  function handleFilterChange(event: CustomEvent<FilterType>) {
    activeFilter = event.detail;
    loadTasks();
  }
</script>

<div class="container mx-auto p-4 max-w-4xl" in:fade>
  <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h1 class="text-3xl font-bold text-gray-800">{t('appTitle')}</h1>
    
      <button 
          on:click={() => { editingTask = null; showForm = !showForm }}
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-2"
      >
          <span class="text-lg">
              {showForm ? '✕' : '+'}
          </span>
          {showForm ? t('cancel') : t('addTask')}
      </button>
  </div>
  
  <!-- Banner de autenticación para crear tareas privadas -->
  {#if !isAuthenticated}
    <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex flex-wrap justify-between items-center gap-3">
      <div>
        <h3 class="font-medium text-blue-800">{$language === 'fr' ? 'Connectez-vous pour plus de fonctionnalités!' : 'Sign in for more features!'}</h3>
        <p class="text-blue-700 text-sm mt-1">
          {t('loginToCreatePrivate')}
        </p>
      </div>
      <div class="flex gap-2">
        <a 
          href="/auth/login" 
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {t('login')}
        </a>
        <a 
          href="/auth/register" 
          class="bg-white text-blue-600 border border-blue-500 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
        >
          {t('register')}
        </a>
      </div>
    </div>
  {/if}
  
  {#if error}
    <SecurityAlert 
      type="error" 
      message={error} 
      dismissable={true}
      autoDismiss={true} 
      duration={5000} 
    />
  {/if}

  {#if showForm}
      <div transition:slide={{duration: 300}}>
          <TaskForm 
              task={editingTask || {}} 
              isEditing={!!editingTask?.id} 
              onSave={(taskData) => {
                const event = new CustomEvent('save', { detail: taskData });
                handleSave(event);
              }}
              onCancel={() => { showForm = false; editingTask = null; }} 
          />
      </div>
  {/if}

  <TaskFilter activeFilter={activeFilter} onFilter={(filter) => {
    const event = new CustomEvent('filter', { detail: filter });
    handleFilterChange(event);
  }} />

  {#if isLoading}
      <div class="flex justify-center py-12" in:fade>
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
  {:else if tasks.length === 0}
      <div class="bg-white p-8 text-center rounded-lg shadow-md border border-gray-100" in:fade>
          <p class="text-lg text-gray-600 mb-4">{t('noTasksFound')}</p>
          <button 
              on:click={() => { editingTask = null; showForm = true }}
              class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition-colors"
          >
              {t('addFirstTask')}
          </button>
      </div>
  {:else}
      <div class="space-y-4 mt-6">
          {#each tasks as task (task.id)}
              <div animate:flip={{duration: 300}}>
                  <TaskItem 
                      {task} 
                      onToggleStatus={(data) => {
                        const event = new CustomEvent('toggleStatus', { detail: data });
                        handleToggleStatus(event);
                      }}
                      onEdit={(task) => {
                        const event = new CustomEvent('edit', { detail: task });
                        handleEdit(event);
                      }}
                      onDelete={(id) => {
                        const event = new CustomEvent('delete', { detail: id });
                        handleDelete(event);
                      }}
                  />
              </div>
          {/each}
      </div>
  {/if}
</div>