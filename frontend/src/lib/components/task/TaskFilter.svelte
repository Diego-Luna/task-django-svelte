<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { TaskFilter } from '$lib/types';
  import { language } from '$lib/stores/language';
  import { createTranslate } from '$lib/i18n/translations';
  
  export let activeFilter: TaskFilter = 'all';
  
  const dispatch = createEventDispatcher<{
    filter: TaskFilter;
  }>();
  
  function setFilter(filter: TaskFilter) {
    dispatch('filter', filter);
  }
  
  $: t = createTranslate($language);
</script>

<div class="mb-6 flex flex-wrap gap-2 bg-white p-4 rounded-lg shadow-sm">
  <span class="text-gray-700 font-medium mr-2 self-center">{t('filter')}</span>
  <button 
      class="px-4 py-2 rounded-md transition-all duration-200 {activeFilter === 'all' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}"
      on:click={() => setFilter('all')}
  >
      {t('all')}
  </button>
  <button 
      class="px-4 py-2 rounded-md transition-all duration-200 {activeFilter === 'todo' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}"
      on:click={() => setFilter('todo')}
  >
      {t('todo')}
  </button>
  <button 
      class="px-4 py-2 rounded-md transition-all duration-200 {activeFilter === 'done' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}"
      on:click={() => setFilter('done')}
  >
      {t('done')}
  </button>
</div>