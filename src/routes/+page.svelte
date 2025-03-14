
<svelte:head>
  <title>DataViz Course Spreadsheet</title>
</svelte:head>

<div class="max-w-[1000px] mx-auto p-8">
  <header class="text-center mb-12">
    <h1 class="text-4xl text-blue mb-2 font-libre-caslon">DataViz Course Spreadsheet</h1>
    <p class="font-archivo">A config-based schema system for Google Spreadsheet integration</p>
  </header>
  
  <main>
    <div class="flex flex-wrap gap-8 mb-12">
      <div class="flex-1 min-w-[250px] bg-base-100 rounded-lg p-8 shadow-md flex flex-col">
        <h2 class="text-neutral mb-4 font-libre-caslon font-bold">Submit New Entry</h2>
        <p class="mb-4 font-archivo">Submit a new entry to the spreadsheet with validation</p>
        <a href="/submit" class="mt-auto inline-block bg-blue text-white py-3 px-6 rounded font-medium text-center transition-colors hover:bg-purple">Go to Form</a>
      </div>
      
      <div class="flex-1 min-w-[250px] bg-base-100 rounded-lg p-8 shadow-md flex flex-col">
        <h2 class="text-neutral mb-4 font-libre-caslon font-bold">View Entries</h2>
        <p class="mb-4 font-archivo">Browse and filter existing entries from the spreadsheet</p>
        <a href="/entries" class="mt-auto inline-block bg-blue text-white py-3 px-6 rounded font-medium text-center transition-colors hover:bg-purple">View Data</a>
      </div>
    </div>
    
    <div class="bg-base-200 p-8 rounded-lg mt-8">
      <h3 class="text-neutral mb-4 text-2xl font-libre-caslon font-bold">About This Project</h3>
      <p class="leading-relaxed mb-4 font-archivo">
        This application provides a type-safe interface to a Google Spreadsheet using Zod for schema validation.
        The schema defines both required fields (date, username, class confidence, summary, keywords) and
        optional fields (sleep hours, skipped meals).
      </p>
      <p class="leading-relaxed mb-4 font-archivo">
        All components use a single source of truth for the schema, ensuring consistency across
        form validation, API endpoints, and spreadsheet operations.
      </p>
    </div>
  </main>
  
  <footer class="mt-12 text-center text-base-300">
    <p class="font-archivo">Built with SvelteKit and Zod Schema Validation</p>
  </footer>
</div>
