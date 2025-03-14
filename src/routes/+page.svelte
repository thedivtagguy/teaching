<script>
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>DataViz Course Spreadsheet</title>
</svelte:head>

<div class="container">
  <header>
    <h1>DataViz Course Spreadsheet</h1>
    <p>A config-based schema system for Google Spreadsheet integration</p>
  </header>
  
  <main>
    <div class="card-container">
      <div class="card">
        <h2>Submit New Entry</h2>
        <p>Submit a new entry to the spreadsheet with validation</p>
        <a href="/submit" class="button">Go to Form</a>
      </div>
      
      <div class="card">
        <h2>View Entries</h2>
        <p>Browse and filter existing entries from the spreadsheet</p>
        <a href="/entries" class="button">View Data</a>
      </div>
    </div>
    
    <div class="info-section">
      <h3>About This Project</h3>
      <p>
        This application provides a type-safe interface to a Google Spreadsheet using Zod for schema validation.
        The schema defines both required fields (date, username, class confidence, summary, keywords) and
        optional fields (sleep hours, skipped meals).
      </p>
      <p>
        All components use a single source of truth for the schema, ensuring consistency across
        form validation, API endpoints, and spreadsheet operations.
      </p>
    </div>
  </main>
  
  <footer>
    <p>Built with SvelteKit and Zod Schema Validation</p>
  </footer>
</div>

<style>
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  h1 {
    color: #2a5885;
    margin-bottom: 0.5rem;
    font-size: 2.5rem;
  }
  
  h2 {
    color: #333;
    margin-bottom: 1rem;
  }
  
  h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  .card-container {
    display: flex;
    gap: 2rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
  }
  
  .card {
    flex: 1;
    min-width: 250px;
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
  }
  
  .button {
    display: inline-block;
    background-color: #2a5885;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 500;
    margin-top: auto;
    text-align: center;
    transition: background-color 0.2s;
  }
  
  .button:hover {
    background-color: #1e4060;
  }
  
  .info-section {
    background-color: #f0f4f8;
    padding: 2rem;
    border-radius: 8px;
    margin-top: 2rem;
  }
  
  footer {
    margin-top: 3rem;
    text-align: center;
    color: #666;
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 1rem;
  }
</style>
