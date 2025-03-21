<script lang="ts">
  import { page } from '$app/stores';
  import { ArrowLeft } from 'lucide-svelte';
  import SEO from '$lib/components/SEO.svelte';
</script>

<SEO 
  title={`${$page.status} - ${$page.error?.message || 'Error'}`}
  description={$page.status === 404 ? 'Page not found' : $page.error?.message || 'An error occurred'}
/>

<div class="container mx-auto px-4 py-12">
  <div class="max-w-3xl mx-auto text-center">
    <h1 class="text-7xl font-bold mb-6 text-primary">{$page.status}</h1>
    
    {#if $page.status === 404}
      <h2 class="text-2xl font-semibold mb-8">Page not found</h2>
      <p class="text-lg mb-8">
        The content you're looking for doesn't seem to exist.
        It might have been removed, renamed, or is still being created.
      </p>
    {:else}
      <h2 class="text-2xl font-semibold mb-8">Something went wrong</h2>
      <p class="text-lg mb-8">
        {$page.error?.message || "We're sorry, but we encountered an unexpected error."}
      </p>
    {/if}
    
    <div class="mt-8">
      <a 
        href="/"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-600 text-white font-medium transition-colors"
      >
        <ArrowLeft size={20} />
        Return to Home
      </a>
    </div>
  </div>
</div>

<style>
  :global(body) {
    background-color: #f8f9fa;
  }
</style> 