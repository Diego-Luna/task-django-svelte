<script lang="ts">
    import { browser } from '$app/environment'; // Añade esta importación
    import { fade, slide } from 'svelte/transition';
    import { language } from '$lib/stores/language';
    import { createTranslate } from '$lib/i18n/translations';
    import { escapeHtml } from '$lib/utils/security';
  
    export let type: 'error' | 'warning' | 'info' = 'error';
    export let message: string = '';
    export let showIcon = true;
    export let dismissable = false;
    export let autoDismiss = false;
    export let duration = 5000;
  
    let visible = true;
    $: t = createTranslate($language);
    $: safeMessage = escapeHtml(message);
  
    if (autoDismiss && browser) {
      setTimeout(() => {
        visible = false;
      }, duration);
    }
  
    function dismiss() {
      visible = false;
    }
  
    // Mapear tipo a colores
    $: colorClass = type === 'error' 
      ? 'bg-red-100 border-red-500 text-red-700' 
      : type === 'warning' 
      ? 'bg-yellow-100 border-yellow-500 text-yellow-700' 
      : 'bg-blue-100 border-blue-500 text-blue-700';
  
    // Mapear tipo a ícono
    $: icon = type === 'error' 
      ? '⚠️' 
      : type === 'warning' 
      ? '⚠️' 
      : 'ℹ️';
  </script>
  
  {#if visible}
    <div 
      class="{colorClass} border-l-4 p-4 mb-4 rounded shadow" 
      in:slide|local={{ duration: 300 }} 
      out:fade|local={{ duration: 200 }}
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          {#if showIcon}
            <span class="mr-2">{icon}</span>
          {/if}
          <span>{@html safeMessage}</span>
        </div>
  
        {#if dismissable}
          <button 
            on:click={dismiss}
            class="text-gray-500 hover:text-gray-700 ml-4"
            aria-label="Cerrar"
          >
            ✕
          </button>
        {/if}
      </div>
    </div>
  {/if}