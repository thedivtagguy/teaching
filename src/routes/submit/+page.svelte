<script>
  import EntryForm from '$lib/components/EntryForm.svelte';
</script>

<svelte:head>
  <title>Submit Data Entry</title>
</svelte:head>

<div class="container">
  <header>
    <h1>DataViz Course</h1>
    <p>Submit your entry using the form below</p>
  </header>
  
  <main>
    <EntryForm />
  </main>
  
  <footer>
    <p>Data is stored in a Google Spreadsheet using the schema-based configuration</p>
  </footer>
</div>

<style>
  .container {
    max-width: 800px;
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
  
  footer {
    margin-top: 3rem;
    text-align: center;
    color: #666;
    font-size: 0.9rem;
  }
</style> 