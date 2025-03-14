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

<div class="container">
  <header>
    <h1>DataViz Course Entries</h1>
    <p>View and filter entries from the Google Spreadsheet</p>
  </header>
  
  <div class="filters">
    <h2>Filter Entries</h2>
    
    <form on:submit|preventDefault={handleSubmit}>
      <div class="filter-group">
        <label>
          <input type="checkbox" bind:checked={filterByUser}>
          Filter by username
        </label>
        
        {#if filterByUser}
          <div class="username-filter">
            <input 
              type="text" 
              bind:value={username} 
              placeholder="Enter username"
              required={filterByUser}
            >
            <button type="submit">Apply Filter</button>
          </div>
        {/if}
      </div>
      
      <button type="button" on:click={resetFilters} class="reset-button">
        Reset Filters
      </button>
    </form>
  </div>
  
  <main>
    {#if loading}
      <p class="loading">Loading entries...</p>
    {:else if error}
      <p class="error">Error: {error}</p>
    {:else if entries.length === 0}
      <p class="no-data">No entries found</p>
    {:else}
      <div class="entries-count">
        Showing {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        {#if filterByUser && username}
          for user <strong>{username}</strong>
        {/if}
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Username</th>
              <th>Class Confidence</th>
              <th>Summary</th>
              <th>Keywords</th>
              {#if entries.some(entry => entry.sleep_hours !== undefined)}
                <th>Sleep Hours</th>
              {/if}
              {#if entries.some(entry => entry.skipped_meals_prev_day)}
                <th>Skipped Meals</th>
              {/if}
            </tr>
          </thead>
          <tbody>
            {#each entries as entry}
              <tr>
                <td>{entry.date}</td>
                <td>{entry.username}</td>
                <td>{entry.class_confidence}</td>
                <td>{entry.sentence_summary}</td>
                <td>
                  <div class="keywords">
                    {#each entry.keywords.split(',').map((k: string) => k.trim()) as keyword}
                      {#if keyword}
                        <span class="keyword">{keyword}</span>
                      {/if}
                    {/each}
                  </div>
                </td>
                {#if entries.some(entry => entry.sleep_hours !== undefined)}
                  <td>{entry.sleep_hours !== undefined ? entry.sleep_hours : '-'}</td>
                {/if}
                {#if entries.some(entry => entry.skipped_meals_prev_day)}
                  <td>{entry.skipped_meals_prev_day || '-'}</td>
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </main>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  header {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  h1 {
    color: #2a5885;
    margin-bottom: 0.5rem;
  }
  
  h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .filters {
    background-color: #f5f5f5;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }
  
  .filter-group {
    margin-bottom: 1rem;
  }
  
  .username-filter {
    margin-top: 0.5rem;
    display: flex;
    gap: 10px;
  }
  
  input[type="text"] {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    flex-grow: 1;
  }
  
  button {
    background-color: #2a5885;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .reset-button {
    background-color: #f44336;
  }
  
  .loading, .error, .no-data {
    text-align: center;
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  
  .error {
    color: #f44336;
  }
  
  .entries-count {
    margin-bottom: 1rem;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f5f5f5;
    font-weight: 600;
  }
  
  tr:hover {
    background-color: #f9f9f9;
  }
  
  .keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .keyword {
    background-color: #e1f5fe;
    color: #0277bd;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.85rem;
    white-space: nowrap;
  }
</style> 