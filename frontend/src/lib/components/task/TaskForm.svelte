<script lang="ts">
  import SecurityAlert from './SecurityAlert.svelte';
  import type { Task } from '$lib/types';
  import { language } from '$lib/stores/language';
  import { createTranslate } from '$lib/i18n/translations';
  import { validateTaskInput } from '$lib/utils/security';

  export let task: Partial<Task> = {
    title: '',
    description: '',
    status: 'todo'
  };
  export let isEditing = false;
  export let onSave: (task: Partial<Task>) => void;
  export let onCancel: () => void;
  
  $: t = createTranslate($language);
  
  // Estado para errores de validación
  let errors: string[] = [];
  let submitAttempted = false;

  function handleSubmit() {
    submitAttempted = true;
    
    // Validar entrada antes de enviar
    const validation = validateTaskInput(task.title, task.description);
    
    if (!validation.valid) {
      errors = validation.errors;
      return;
    }
    
    errors = [];
    onSave({
      ...task,
      title: task.title?.trim() || '',
      description: task.description?.trim() || null
    });
  }

  function handleCancel() {
    errors = [];
    submitAttempted = false;
    onCancel();
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
  <h2 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
    {isEditing ? t('editTask') : t('addTask')}
  </h2>
  
  {#if errors.length > 0}
    <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
      <ul class="list-disc list-inside">
        {#each errors as error}
          <li>{error}</li>
        {/each}
      </ul>
    </div>
  {/if}
  
  <div class="mb-4">
    <label for="title" class="block text-gray-700 font-medium mb-1">{t('title')}</label>
    <input
      type="text"
      id="title"
      bind:value={task.title}
      required
      class="w-full px-3 py-2 border {submitAttempted && !task.title ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      placeholder={$language === 'fr' ? "Entrez le titre de la tâche" : "Enter task title"}
      maxlength="200"
      pattern="[^<>]*" 
      title="No se permiten los caracteres < o >"
    />
  </div>
  
  <div class="mb-4">
    <label for="description" class="block text-gray-700 font-medium mb-1">
      {t('description')} <span class="text-gray-500 text-sm">({t('optional')})</span>
    </label>
    <textarea
      id="description"
      bind:value={task.description}
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      rows="3"
      placeholder={$language === 'fr' ? "Entrez la description de la tâche" : "Enter task description"}
      maxlength="1000"
    ></textarea>
  </div>
  
  <div class="mb-6">
    <label for="status" class="block text-gray-700 font-medium mb-1">{t('status')}</label>
    <select
      id="status"
      bind:value={task.status}
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      <option value="todo">{t('todo')}</option>
      <option value="done">{t('done')}</option>
    </select>
  </div>
  
  <div class="flex justify-end space-x-2">
    <button
      type="button"
      on:click={handleCancel}
      class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
    >
      {t('cancel')}
    </button>
    <button
      type="submit"
      class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      {isEditing ? t('update') : t('save')}
    </button>
  </div>
</form>