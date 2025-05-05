<script lang="ts">
  import SecurityAlert from './SecurityAlert.svelte';
  import type { Task } from '$lib/types/types';
  import { language } from '$lib/stores/language';
  import { createTranslate } from '$lib/i18n/translations';
  import { validateTaskInput } from '$lib/utils/security';
  import { auth } from '$lib/stores/auth';
  import { browser } from '$app/environment';
  import { fade, scale } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { onDestroy } from 'svelte';

  export let task: Partial<Task> = {
    title: '',
    description: '',
    status: 'todo',
    visibility: 'global'  // Default visibility is global
  };
  export let isEditing = false;
  export let onSave: (task: Partial<Task>) => void;
  export let onCancel: () => void;
  
  $: t = createTranslate($language);
  $: isAuthenticated = $auth.isAuthenticated;
  
  // Estado para errores de validación
  let errors: string[] = [];
  let submitAttempted = false;

  // Variables para la funcionalidad de reconocimiento de voz
  let isListening = false;
  let recognitionError: string | null = null;
  let speechRecognition: any = null;
  let activeField: 'title' | 'description' | null = null;
  
  // Variable para mostrar información sobre compatibilidad de navegadores
  let showCompatInfo = false;

  // Comprobación mejorada de soporte para reconocimiento de voz
  let browserSupport = {
    supported: false,
    browser: '',
    quality: ''
  };
  
  if (browser) {
    // Comprobamos qué API está disponible
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      browserSupport.supported = true;
      
      // Determinamos el navegador
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('chrome') > -1) {
        browserSupport.browser = 'Chrome';
        browserSupport.quality = 'excellent';
      } else if (userAgent.indexOf('edge') > -1) {
        browserSupport.browser = 'Edge';
        browserSupport.quality = 'good';
      } else if (userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1) {
        browserSupport.browser = 'Safari';
        browserSupport.quality = 'limited';
      } else if (userAgent.indexOf('firefox') > -1) {
        browserSupport.browser = 'Firefox';
        browserSupport.quality = 'experimental';
      } else {
        browserSupport.browser = 'Your browser';
        browserSupport.quality = 'unknown';
      }
    }
  }

  // Comprobar si el navegador soporta reconocimiento de voz
  let speechRecognitionSupported = browserSupport.supported;

  // Valores para la animación del micrófono (usando tweened en lugar de spring)
  const pulseScale = tweened(1, {
    duration: 300,
    easing: cubicOut
  });

  // Manejar la animación del pulso cuando está escuchando
  let pulseInterval: ReturnType<typeof setInterval>;
  
  $: if (isListening) {
    // Limpiar intervalo anterior si existe
    clearInterval(pulseInterval);
    
    pulseInterval = setInterval(() => {
      pulseScale.set(1.3);
      setTimeout(() => pulseScale.set(1), 300);
    }, 600);
  } else if (pulseInterval) {
    clearInterval(pulseInterval);
  }
  
  // Asegurarnos de limpiar el intervalo cuando se destruye el componente
  onDestroy(() => {
    if (pulseInterval) {
      clearInterval(pulseInterval);
    }
    
    if (speechRecognition) {
      try {
        speechRecognition.abort();
      } catch (e) {
        // Ignorar errores al abortar
      }
    }
  });

  function toggleCompatInfo() {
    showCompatInfo = !showCompatInfo;
  }

  function toggleSpeechRecognition(fieldName: 'title' | 'description') {
    // Si ya está escuchando, detener la escucha
    if (isListening && activeField === fieldName) {
      stopSpeechRecognition();
      return;
    }
    
    // Si no está escuchando, iniciar la escucha
    startSpeechRecognition(fieldName);
  }

  function startSpeechRecognition(fieldName: 'title' | 'description') {
    if (!speechRecognitionSupported) {
      recognitionError = $language === 'fr' 
        ? 'Votre navigateur ne prend pas en charge la reconnaissance vocale' 
        : 'Your browser does not support speech recognition';
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    // Limpiar instancia anterior si existe
    if (speechRecognition) {
      speechRecognition.abort();
      speechRecognition = null;
    }
    
    speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = false;
    speechRecognition.lang = $language === 'fr' ? 'fr-FR' : 'en-US';
    speechRecognition.interimResults = false;
    speechRecognition.maxAlternatives = 1;
    
    activeField = fieldName;
    isListening = true;
    recognitionError = null;
    
    speechRecognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      
      if (activeField === 'title') {
        task.title = transcript;
      } else if (activeField === 'description') {
        // Append text to description or initialize it
        task.description = task.description 
          ? `${task.description} ${transcript}` 
          : transcript;
      }
      
      stopSpeechRecognition();
    };
    
    speechRecognition.onerror = (event: any) => {
      stopSpeechRecognition();
      recognitionError = $language === 'fr' 
        ? `Erreur de reconnaissance vocale: ${event.error}` 
        : `Speech recognition error: ${event.error}`;
    };
    
    speechRecognition.onend = () => {
      stopSpeechRecognition();
    };
    
    speechRecognition.start();
  }
  
  function stopSpeechRecognition() {
    if (speechRecognition) {
      speechRecognition.stop();
    }
    isListening = false;
    activeField = null;
  }

  function handleSubmit() {
    submitAttempted = true;
    
    // Validate input before submitting
    const validation = validateTaskInput(task.title, task.description);
    
    if (!validation.valid) {
      errors = validation.errors;
      return;
    }
    
    errors = [];
    onSave({
      ...task,
      title: task.title?.trim() || '',
      description: task.description?.trim() || null,
      // If not authenticated, force global visibility
      visibility: isAuthenticated ? task.visibility : 'global'
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
  
  {#if recognitionError}
    <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
      <p>{recognitionError}</p>
    </div>
  {/if}
  
  <!-- Información de compatibilidad de navegadores -->
  {#if speechRecognitionSupported && showCompatInfo}
    <div class="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4 text-sm" transition:fade={{duration: 200}}>
      <h3 class="font-medium text-blue-800 mb-1">
        {$language === 'fr' ? 'Compatibilité du navigateur' : 'Browser Compatibility'}
      </h3>
      <ul class="space-y-1 text-blue-700">
        <li>Chrome/Edge: 
          <span class="text-green-600 font-medium">
            {$language === 'fr' ? 'Excellente compatibilité' : 'Excellent compatibility'}
          </span>
        </li>
        <li>Safari: 
          <span class="text-yellow-600 font-medium">
            {$language === 'fr' ? 'Compatibilité limitée' : 'Limited compatibility'}
          </span>
        </li>
        <li>Firefox: 
          <span class="text-orange-600 font-medium">
            {$language === 'fr' ? 'Support expérimental' : 'Experimental support'}
          </span>
        </li>
      </ul>
    </div>
  {/if}
  
  <div class="mb-4">
    <div class="flex justify-between items-center mb-1">
      <label for="title" class="block text-gray-700 font-medium">{t('title')}</label>
      {#if speechRecognitionSupported}
        <div class="flex items-center gap-2">
          <button 
            type="button"
            on:click={() => toggleSpeechRecognition('title')}
            class="group relative px-2 py-1 text-xs {isListening && activeField === 'title' ? 'bg-red-100 text-red-800' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'} rounded flex items-center gap-1 transition-colors"
            title={isListening && activeField === 'title' ? ($language === 'fr' ? 'Arrêter l\'écoute' : 'Stop listening') : ($language === 'fr' ? 'Commencer l\'écoute' : 'Start listening')}
          >
            {#if isListening && activeField === 'title'}
              <div class="relative">
                <div 
                  class="absolute -inset-1 rounded-full bg-red-400 transition-all" 
                  style="transform: scale({$pulseScale}); opacity: {2 - $pulseScale};"
                ></div>
                <svg class="relative w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <span>{$language === 'fr' ? 'Écoute...' : 'Listening...'}</span>
            {:else}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span>{t('dictate')}</span>
            {/if}
          </button>
          
          <button 
            type="button" 
            class="text-blue-500 hover:text-blue-700 text-xs" 
            on:click={toggleCompatInfo}
            title={$language === 'fr' ? 'Afficher les informations de compatibilité' : 'Show compatibility info'}
          >
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="ml-1">{showCompatInfo ? '−' : '+'}</span>
            </span>
          </button>
        </div>
      {/if}
    </div>
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
    <div class="flex justify-between items-center mb-1">
      <label for="description" class="block text-gray-700 font-medium">
        {t('description')} <span class="text-gray-500 text-sm">({t('optional')})</span>
      </label>
      {#if speechRecognitionSupported}
        <button 
          type="button"
          on:click={() => toggleSpeechRecognition('description')}
          class="px-2 py-1 text-xs {isListening && activeField === 'description' ? 'bg-red-100 text-red-800' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'} rounded flex items-center gap-1 transition-colors"
          title={isListening && activeField === 'description' ? ($language === 'fr' ? 'Arrêter l\'écoute' : 'Stop listening') : ($language === 'fr' ? 'Commencer l\'écoute' : 'Start listening')}
        >
          {#if isListening && activeField === 'description'}
            <div class="relative">
              <div 
                class="absolute -inset-1 rounded-full bg-red-400 transition-all"
                style="transform: scale({$pulseScale}); opacity: {2 - $pulseScale};"
              ></div>
              <svg class="relative w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span>{$language === 'fr' ? 'Écoute...' : 'Listening...'}</span>
          {:else}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span>{t('dictate')}</span>
          {/if}
        </button>
      {/if}
    </div>
    <textarea
      id="description"
      bind:value={task.description}
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      rows="3"
      placeholder={$language === 'fr' ? "Entrez la description de la tâche" : "Enter task description"}
      maxlength="1000"
    ></textarea>
  </div>
  
  <div class="mb-4">
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
  
  <!-- Mostrar opciones de visibilidad solo para usuarios autenticados -->
  {#if isAuthenticated}
    <div class="mb-6">
      <label for="visibility" class="block text-gray-700 font-medium mb-1">{t('visibility')}</label>
      <select
        id="visibility"
        bind:value={task.visibility}
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <option value="private">{t('private')}</option>
        <option value="global">{t('global')}</option>
      </select>
      <p class="text-xs text-gray-500 mt-1">
        {task.visibility === 'private' ? 
          ($language === 'fr' ? 'Uniquement visible par vous' : 'Only visible to you') : 
          ($language === 'fr' ? 'Visible par tous les utilisateurs' : 'Visible to all users')}
      </p>
    </div>
  {:else}
    <div class="mb-6">
      <input type="hidden" bind:value={task.visibility} />
      <div class="bg-blue-50 p-3 rounded-md border border-blue-100">
        <p class="text-sm text-blue-700 flex items-center gap-1">
          <span>ℹ️</span>
          {t('loginToCreatePrivate')}
          <a href="/auth/login" class="ml-1 text-blue-600 underline hover:text-blue-800">
            {t('login')} →
          </a>
        </p>
      </div>
    </div>
  {/if}
  
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