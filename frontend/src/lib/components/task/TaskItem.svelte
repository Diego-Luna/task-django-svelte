<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { Task } from '$lib/types/types';
  import { language } from '$lib/stores/language';
  import { createTranslate } from '$lib/i18n/translations';
  import { escapeHtml } from '$lib/utils/security';
  import { auth } from '$lib/stores/auth';

  export let task: Task;
  export let onToggleStatus: (data: { id: number, status: 'todo' | 'done' }) => void;
  export let onEdit: (task: Task) => void;
  export let onDelete: (id: number) => void;

  $: t = createTranslate($language);
  $: isAuthenticated = $auth.isAuthenticated;
  $: isOwner = isAuthenticated && task.user?.id === $auth.user?.id;
  
  // Determinar si este usuario puede editar la tarea
  $: canEdit = isOwner;
  
  // Determinar si este usuario puede cambiar el estado de la tarea
  $: canToggleStatus = isAuthenticated || task.user === null;
  
  // Escapar contenido potencialmente peligroso
  $: safeTitle = escapeHtml(task.title);
  $: safeDescription = escapeHtml(task.description);
  $: safeUsername = escapeHtml(task.owner_username || '');
  $: isGlobal = task.visibility === 'global';
  $: isAnonymousTask = task.user === null;

  function toggleStatus() {
    const newStatus = task.status === 'todo' ? 'done' : 'todo';
    onToggleStatus({ id: task.id ?? 0, status: newStatus });
  }

  function handleEdit() {
    onEdit(task);
  }

  function handleDelete() {
    onDelete(task.id ?? 0);
  }

  // Format date for better display
  function formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      // Format date based on user language
      return date.toLocaleString($language === 'fr' ? 'fr-FR' : 'en-US');
    } catch (e) {
      return 'Error';
    }
  }
</script>

<div 
  class="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 mb-4 border-l-4 
    {task.status === 'done' ? 'border-green-500' : 'border-yellow-500'}
    {isGlobal ? 'bg-white' : 'bg-blue-50'}"
  in:fade={{duration: 200}}
>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        {#if isGlobal}
          <span class="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
            {t('global')}
          </span>
        {:else}
          <span class="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
            {t('private')}
          </span>
        {/if}
        
        {#if task.user && task.owner_username}
          <span class="text-xs text-gray-500">
            {t('createdBy')} <strong>{safeUsername}</strong>
          </span>
        {:else}
          <span class="text-xs text-gray-500 italic">
            {$language === 'fr' ? 'Tâche anonyme' : 'Anonymous task'}
          </span>
        {/if}
      </div>
      
      <h3 class="text-lg font-medium {task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-800'}">
        {safeTitle}
      </h3>
      
      {#if task.description}
        <p class="text-gray-600 mt-2 {task.status === 'done' ? 'line-through' : ''}">
          {safeDescription}
        </p>
      {/if}
      
      <p class="text-xs text-gray-500 mt-2">
        {t('created')} {formatDate(task.created_at)}
      </p>
    </div>
    
    <div class="flex flex-wrap gap-2">
      {#if canToggleStatus}
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
          {task.status === 'todo' ? t('complete') : t('reopen')}
        </button>
      {/if}
      
      {#if canEdit}
        <button 
          on:click={handleEdit}
          class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-all hover:shadow-md"
        >
          {t('update')}
        </button>
        
        <button 
          on:click={handleDelete}
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-all hover:shadow-md"
        >
          {t('delete')}
        </button>
      {/if}
    </div>
  </div>
</div>