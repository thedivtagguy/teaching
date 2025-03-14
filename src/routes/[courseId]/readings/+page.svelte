<script lang="ts">
  import { page } from '$app/stores';
  import { BookOpen, ExternalLink  } from 'lucide-svelte';
  
  // Interface definitions
  interface Reading {
    title: string;
    author?: string;
    pages?: string;
    url?: string;
    source?: string;
    path?: string;
  }
  
  // Get course ID from URL params
  $: courseId = $page.params.courseId;
  
  // Get readings from the server
  $: allReadings = ($page.data?.readings || []) as Reading[];
  
  // Group readings by source (which day or section)
  $: readingGroups = groupReadingsBySource(allReadings);
  
  // Function to group readings by source
  function groupReadingsBySource(readings: Reading[]): Record<string, Reading[]> {
    return readings.reduce((groups: Record<string, Reading[]>, reading: Reading) => {
      const source = reading.source || 'General';
      if (!groups[source]) {
        groups[source] = [];
      }
      groups[source].push(reading);
      return groups;
    }, {});
  }
  
  // Keep track of saved readings (would usually be stored in a database or localStorage)
  let savedReadings = new Set<string>();
  

</script>

<svelte:head>
  <title>Readings | {courseId.toUpperCase()}</title>
  <meta name="description" content="Course readings for {courseId.toUpperCase()}">
</svelte:head>

<div class="max-w-4xl mx-auto noise-image">
  <!-- Header -->
  <div class="mb-8 border-b-2 border-neutral pb-4">
    <h1 class="text-4xl font-libre-caslon mb-2 flex items-center text-neutral">
      <BookOpen class="w-8 h-8 mr-3 text-blue" />
      Readings
    </h1>
    <p class="text-lg text-base-300 font-archivo">
      All required and recommended readings for {courseId.toUpperCase()}.
    </p>
  </div>
  
  {#if Object.keys(readingGroups).length === 0}
    <div class="bg-base-200 rounded-lg p-8 text-center border-2 border-neutral btn-drop-shadow">
      <p class="text-neutral font-archivo font-bold">No readings have been assigned for this course yet.</p>
      <a href="/{courseId}" class="inline-block mt-4 bg-blue hover:bg-purple text-white font-roboto font-bold px-4 py-2 rounded-md border-2 border-neutral btn-drop-shadow uppercase transition-colors">
        Return to Course
      </a>
    </div>
  {:else}
    <!-- Reading List -->
    <div class="bg-base-100 rounded-lg overflow-hidden border-2 border-neutral btn-drop-shadow">
      {#each Object.entries(readingGroups) as [source, readings], index}
        <div class={`${index > 0 ? 'border-t-2 border-base-300' : ''}`}>
          <div class="bg-base-200 px-6 py-3">
            <h2 class="font-roboto font-bold text-lg text-neutral uppercase">{source}</h2>
          </div>
          
          <ul class="divide-y divide-base-300">
            {#each readings as reading}
              <li class="p-6 hover:bg-base-200 transition-colors">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-libre-caslon font-bold text-lg text-neutral">{reading.title}

                      {#if reading.author}
                      <span class="text-neutral font-normal text-xs mt-1 font-archivo">by {reading.author}</span>
                    {/if}
                    </h3>
                    
                   
                    
                    <div class="flex items-center mt-2 text-sm text-neutral font-bold font-archivo">
                      {#if reading.pages}
                        <span class="mr-4">Pages: {reading.pages}</span>
                      {/if}
                      
                      {#if reading.path}
                        <a href={reading.path} class="text-blue hover:text-purple mr-4 flex items-center font-bold">
                          <span>View More</span>
                        </a>
                      {/if}
                    </div>
                  </div>
                  
                  <div class="flex space-x-2">
                    {#if reading.url}
                      <a 
                        href={reading.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="p-2 rounded-md bg-base-200 text-neutral hover:bg-blue hover:text-white transition-colors border-2 border-neutral btn-drop-shadow"
                        aria-label="Open reading resource"
                      >
                        <ExternalLink class="w-5 h-5" />
                      </a>
                    {/if}
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  {/if}
  
  <!-- Back to course -->
  <div class="mt-8 flex justify-center">
    <a 
      href="/{courseId}" 
      class="px-6 py-3 bg-base-200 text-neutral font-roboto font-bold rounded-md hover:bg-neutral hover:text-white transition-colors border-2 border-neutral btn-drop-shadow uppercase"
    >
      Back to Course
    </a>
  </div>
</div> 