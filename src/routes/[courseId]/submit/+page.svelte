<script>
  import EntryForm from '$lib/components/EntryForm.svelte';
  
</script>

<svelte:head>
  <title>Submit Daily Entry</title>
</svelte:head>

  <div class="relative">
    <div class="noise-bg absolute top-0 left-0 w-full h-full pointer-events-none"></div>
    <div class="content-wrapper relative z-10">
      <header class="mb-8 border-b-2 space-y-2 border-neutral pb-4">
        <h1 class="text-4xl font-libre-caslon text-neutral">   What's up, doc?</h1>
        <p class="text-lg mt-2 text-base-300 font-archivo">
          Hope you had a good day! Submit your daily entry here.
        </p>
      </header>
      
      <main>
        <EntryForm />
      </main>
    </div>
  </div>


<style>
  .noise-bg {
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 245 245' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='8.51' numOctaves='10' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    mix-blend-mode: overlay;
    opacity: 1;
    z-index: 1;
  }
</style> 