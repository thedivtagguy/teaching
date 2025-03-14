<script lang="ts">
  import { onMount } from 'svelte';
  import { spreadsheetConfig, type SpreadsheetEntry } from '$lib/schema';
  
  let entries: SpreadsheetEntry[] = [];
  let loading = true;
  let error: string | null = null;
  let username = '';
  let filterByUser = false;
  
  // Fetch all entries on mount
  onMount(async () => {
    await fetchEntries();
  });
  
  // Fetch entries (all or filtered by username)
  async function fetchEntries() {
    loading = true;
    error = null;
    
    try {
      if (filterByUser && username) {
        // Fetch entries for a specific user
        const response = await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username })
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch entries');
        }
        
        entries = await response.json();
      } else {
        // Fetch all entries
        const response = await fetch('/api/entries');
        
        if (!response.ok) {
          throw new Error('Failed to fetch entries');
        }
        
        entries = await response.json();
      }
    } catch (err: unknown) {
      console.error('Error fetching entries:', err);
      error = err instanceof Error ? err.message : 'An unknown error occurred';
      entries = [];
    } finally {
      loading = false;
    }
  }
  
  // Handle form submission for filtering
  function handleSubmit() {
    fetchEntries();
  }
  
  // Reset filters
  function resetFilters() {
    username = '';
    filterByUser = false;
    fetchEntries();
  }
</script>

<svelte:head>
  <title>Data Entries</title>
</svelte:head>

<div class="max-w-[1200px] mx-auto p-8">
  <header class="mb-8 text-center">
    <h1 class="text-blue mb-2 font-libre-caslon text-4xl font-bold">DataViz Course Entries</h1>
    <p class="font-archivo">View and filter entries from the Google Spreadsheet</p>
  </header>
  
  <div class="bg-base-200 p-6 rounded-lg mb-8">
    <h2 class="text-xl text-neutral mb-4 font-libre-caslon font-bold">Filter Entries</h2>
    
    <form on:submit|preventDefault={handleSubmit}>
      <div class="mb-4">
        <label class="flex items-center gap-2 font-archivo">
          <input type="checkbox" bind:checked={filterByUser}>
          Filter by username
        </label>
        
        {#if filterByUser}
          <div class="mt-2 flex gap-2">
            <input 
              type="text" 
              bind:value={username} 
              placeholder="Enter username"
              required={filterByUser}
              class="py-2 px-3 border border-base-300 rounded flex-grow font-archivo"
            >
            <button type="submit" class="bg-blue text-white py-2 px-4 rounded font-archivo hover:bg-purple transition-colors">Apply Filter</button>
          </div>
        {/if}
      </div>
      
      <button type="button" on:click={resetFilters} class="bg-red text-white py-2 px-4 rounded font-archivo hover:opacity-90 transition-opacity">
        Reset Filters
      </button>
    </form>
  </div>
  
  <main>
    {#if loading}
      <p class="text-center py-8 bg-base-100 rounded-lg font-archivo">Loading entries...</p>
    {:else if error}
      <p class="text-center py-8 bg-base-100 rounded-lg text-red font-archivo">Error: {error}</p>
    {:else if entries.length === 0}
      <p class="text-center py-8 bg-base-100 rounded-lg font-archivo">No entries found</p>
    {:else}
      <div class="mb-4 font-archivo">
        Showing {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        {#if filterByUser && username}
          for user <strong>{username}</strong>
        {/if}
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead class="bg-base-200">
            <tr>
              <th class="border border-base-300 p-3 text-left font-archivo">Date</th>
              <th class="border border-base-300 p-3 text-left font-archivo">Username</th>
              <th class="border border-base-300 p-3 text-left font-archivo">Class Confidence</th>
              <th class="border border-base-300 p-3 text-left font-archivo">Summary</th>
              <th class="border border-base-300 p-3 text-left font-archivo">Keywords</th>
              {#if entries.some(entry => entry.sleep_hours !== undefined)}
                <th class="border border-base-300 p-3 text-left font-archivo">Sleep Hours</th>
              {/if}
              {#if entries.some(entry => entry.skipped_meals_prev_day)}
                <th class="border border-base-300 p-3 text-left font-archivo">Skipped Meals</th>
              {/if}
            </tr>
          </thead>
          <tbody>
            {#each entries as entry}
              <tr class="hover:bg-base-200">
                <td class="border border-base-300 p-3 font-archivo">{entry.date}</td>
                <td class="border border-base-300 p-3 font-archivo">{entry.username}</td>
                <td class="border border-base-300 p-3 font-archivo">{entry.class_confidence}</td>
                <td class="border border-base-300 p-3 font-archivo">{entry.sentence_summary}</td>
                <td class="border border-base-300 p-3 font-archivo">
                  <div class="flex flex-wrap gap-1">
                    {#each entry.keywords.split(',').map((k: string) => k.trim()) as keyword}
                      {#if keyword}
                        <span class="bg-blue bg-opacity-10 text-blue px-2 py-1 rounded-full text-sm">{keyword}</span>
                      {/if}
                    {/each}
                  </div>
                </td>
                {#if entries.some(entry => entry.sleep_hours !== undefined)}
                  <td class="border border-base-300 p-3 font-archivo">{entry.sleep_hours !== undefined ? entry.sleep_hours : '-'}</td>
                {/if}
                {#if entries.some(entry => entry.skipped_meals_prev_day)}
                  <td class="border border-base-300 p-3 font-archivo">{entry.skipped_meals_prev_day || '-'}</td>
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </main>
</div> 