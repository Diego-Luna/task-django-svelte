
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import SecurityAlert from '$lib/components/task/SecurityAlert.svelte';
    import { language } from '$lib/stores/language';
    import { createTranslate } from '$lib/i18n/translations';
    import { register } from '../../../service/auth';
    
    export let redirectTo = '/auth/login';
  
    const dispatch = createEventDispatcher();
    
    $: t = createTranslate($language);
  
    let username = '';
    let email = '';
    let password = '';
    let password_confirm = '';
    let first_name = '';
    let last_name = '';
    let loading = false;
    let error: string | null = null;
    let success: string | null = null;
    let submitAttempted = false;
  
    async function handleSubmit() {
      submitAttempted = true;
      
      // Validación básica
      if (!username || !email || !password || !password_confirm) {
        error = 'Please fill in all required fields';
        return;
      }
      
      if (password !== password_confirm) {
        error = t('passwordsDoNotMatch');
        return;
      }
      
      loading = true;
      error = null;
      success = null;
      
      try {
        await register({ 
          username, 
          email, 
          password, 
          password_confirm,
          first_name: first_name || undefined,
          last_name: last_name || undefined
        });
        
        success = t('registerSuccess');
        dispatch('register', { username, email });
        
        // Redirigir después de un registro exitoso tras un breve retraso
        setTimeout(() => goto(redirectTo), 2000);
        
      } catch (err) {
        error = err instanceof Error ? err.message : 'Registration failed';
      } finally {
        loading = false;
      }
    }
  </script>
  
  <form 
    on:submit|preventDefault={handleSubmit} 
    class="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100 max-w-md mx-auto"
    transition:fade={{ duration: 300 }}
  >
    <h2 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
      {t('register')}
    </h2>
  
    {#if error}
      <SecurityAlert 
        type="error" 
        message={error} 
        dismissable={true}
        autoDismiss={true} 
        duration={5000} 
      />
    {/if}
  
    {#if success}
      <SecurityAlert 
        type="info" 
        message={success} 
        dismissable={true}
        autoDismiss={true} 
        duration={5000} 
      />
    {/if}
  
    <div class="mb-4">
      <label for="username" class="block text-gray-700 font-medium mb-1">
        {t('username')} *
      </label>
      <input
        type="text"
        id="username"
        bind:value={username}
        required
        disabled={loading}
        class="w-full px-3 py-2 border {submitAttempted && !username ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />
    </div>
  
    <div class="mb-4">
      <label for="email" class="block text-gray-700 font-medium mb-1">
        {t('email')} *
      </label>
      <input
        type="email"
        id="email"
        bind:value={email}
        required
        disabled={loading}
        class="w-full px-3 py-2 border {submitAttempted && !email ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />
    </div>
  
    <div class="mb-4">
      <label for="password" class="block text-gray-700 font-medium mb-1">
        {t('password')} *
      </label>
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        disabled={loading}
        class="w-full px-3 py-2 border {submitAttempted && !password ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />
    </div>
  
    <div class="mb-4">
      <label for="password_confirm" class="block text-gray-700 font-medium mb-1">
        {t('confirmPassword')} *
      </label>
      <input
        type="password"
        id="password_confirm"
        bind:value={password_confirm}
        required
        disabled={loading}
        class="w-full px-3 py-2 border {submitAttempted && (!password_confirm || password !== password_confirm) ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />
      {#if submitAttempted && password !== password_confirm}
        <p class="text-red-500 text-xs mt-1">{t('passwordsDoNotMatch')}</p>
      {/if}
    </div>
  
    <div class="mb-4">
      <label for="first_name" class="block text-gray-700 font-medium mb-1">
        {t('firstName')} <span class="text-gray-500 text-sm">({t('optional')})</span>
      </label>
      <input
        type="text"
        id="first_name"
        bind:value={first_name}
        disabled={loading}
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />
    </div>
  
    <div class="mb-6">
      <label for="last_name" class="block text-gray-700 font-medium mb-1">
        {t('lastName')} <span class="text-gray-500 text-sm">({t('optional')})</span>
      </label>
      <input
        type="text"
        id="last_name"
        bind:value={last_name}
        disabled={loading}
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />
    </div>
  
    <div class="flex justify-between items-center">
      <button
        type="submit"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center"
        disabled={loading}
      >
        {#if loading}
          <span class="mr-2">
            <span class="animate-spin inline-block h-4 w-4 border-t-2 border-white rounded-full"></span>
          </span>
        {/if}
        {t('register')}
      </button>
      
      <a href="/auth/login" class="text-blue-500 hover:text-blue-700 text-sm">
        {t('login')}
      </a>
    </div>
  </form>