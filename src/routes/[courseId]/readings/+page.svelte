<script lang="ts">
  import { page } from '$app/stores';
  import { BookOpen, ExternalLink, BookmarkIcon } from 'lucide-svelte';
  
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
  
  function toggleSaveReading(title: string): void {
    if (savedReadings.has(title)) {
      savedReadings.delete(title);
    } else {
      savedReadings.add(title);
    }
    savedReadings = savedReadings; // Trigger reactivity
  }
</script>

<svelte:head>
  <title>Readings | {courseId.toUpperCase()}</title>
  <meta name="description" content="Course readings for {courseId.toUpperCase()}">
</svelte:head>

<div class="max-w-4xl mx-auto">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-libre-caslon mb-2 flex items-center text-blue-900">
      <BookOpen class="w-8 h-8 mr-3 text-blue-600" />
      Course Readings
    </h1>
    <p class="text-lg text-gray-700 font-archivo">
      All required and recommended readings for {courseId.toUpperCase()}.
    </p>
  </div>
  
  {#if Object.keys(readingGroups).length === 0}
    <div class="bg-blue-50 rounded-lg p-8 text-center border border-blue-100">
      <p class="text-blue-800 font-archivo">No readings have been assigned for this course yet.</p>
      <a href="/{courseId}" class="inline-block mt-4 bg-blue-600 text-white font-archivo px-4 py-2 rounded hover:bg-blue-700 transition-colors">
        Return to Course
      </a>
    </div>
  {:else}
    <!-- Reading List -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      {#each Object.entries(readingGroups) as [source, readings], index}
        <div class={`${index > 0 ? 'border-t border-gray-100' : ''}`}>
          <div class="bg-blue-50 px-6 py-3">
            <h2 class="font-archivo font-semibold text-lg text-blue-800">{source}</h2>
          </div>
          
          <ul class="divide-y divide-gray-100">
            {#each readings as reading}
              <li class="p-6 hover:bg-blue-50 transition-colors">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-archivo font-semibold text-lg text-gray-900">{reading.title}</h3>
                    
                    {#if reading.author}
                      <p class="text-gray-700 mt-1">by {reading.author}</p>
                    {/if}
                    
                    <div class="flex items-center mt-2 text-sm text-gray-600">
                      {#if reading.pages}
                        <span class="mr-4">Pages: {reading.pages}</span>
                      {/if}
                      
                      {#if reading.path}
                        <a href={reading.path} class="text-blue-600 hover:text-blue-800 mr-4 flex items-center">
                          <span>View Lesson</span>
                        </a>
                      {/if}
                    </div>
                  </div>
                  
                  <div class="flex space-x-2">
                    <button 
                      on:click={() => toggleSaveReading(reading.title)}
                      class="p-2 rounded-full {savedReadings.has(reading.title) ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'} hover:bg-yellow-100 hover:text-yellow-600 transition-colors"
                      aria-label={savedReadings.has(reading.title) ? "Unsave reading" : "Save reading"}
                    >
                      <BookmarkIcon class="w-5 h-5" />
                    </button>
                    
                    {#if reading.url}
                      <a 
                        href={reading.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
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
      class="px-6 py-3 bg-gray-100 text-gray-700 font-archivo rounded-lg hover:bg-gray-200 transition-colors"
    >
      Back to Course
    </a>
  </div>
</div> 