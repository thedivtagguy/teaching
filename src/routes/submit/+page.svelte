<script>
  import EntryForm from '$lib/components/EntryForm.svelte';
</script>

<svelte:head>
  <title>Submit Data Entry</title>
</svelte:head>

<div class="max-w-[800px] mx-auto p-8">
  <header class="mb-8 text-center">
    <h1 class="text-blue mb-2 font-libre-caslon text-4xl font-bold">DataViz Course</h1>
    <p class="font-archivo">Submit your entry using the form below</p>
  </header>
  
  <main>
    <EntryForm />
  </main>
  
  <footer class="mt-12 text-center text-base-300 text-sm font-archivo">
    <p>Data is stored in a Google Spreadsheet using the schema-based configuration</p>
  </footer>
</div> 