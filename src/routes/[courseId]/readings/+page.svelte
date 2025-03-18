<script lang="ts">
  import { page } from '$app/stores';
  import { BookOpen, ExternalLink, Check, BookOpenCheck } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { confetti } from '@neoconfetti/svelte';
  
  // Interface definitions
  interface Reading {
    title: string;
    author?: string;
    pages?: string;
    url?: string;
    source?: string;
    path?: string;
    readingTime?: string;
  }
  
  // Get course ID from URL params
  $: courseId = $page.params.courseId;
  
  // Get readings from the server
  $: allReadings = ($page.data?.readings || []) as Reading[];
  
  // Group readings by source (which day or section)
  $: readingGroups = groupReadingsBySource(allReadings);
  
  // Confetti state
  let showConfetti = false;
  let confettiElement: HTMLElement;
  
  // Reading to show confetti for
  let confettiForReading: Reading | null = null;
  
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
  
  // Keep track of completed readings using localStorage
  let completedReadings = new Set<string>();
  
  // Generate a unique key for each reading
  function getReadingKey(reading: Reading): string {
    return `${courseId}_reading_${reading.title.replace(/\s+/g, '_')}`;
  }
  
  // Toggle reading completion status
  function toggleReadingCompletion(reading: Reading) {
    const key = getReadingKey(reading);
    
    if (completedReadings.has(key)) {
      completedReadings.delete(key);
      localStorage.setItem(key, '');
      localStorage.removeItem(key);
    } else {
      completedReadings.add(key);
      localStorage.setItem(key, 'completed');
      
      // Show confetti for this specific reading
      confettiForReading = reading;
      setTimeout(() => confettiForReading = null, 3000);
    }
    
    // Use simpler approach to trigger reactivity - just assign to itself
    completedReadings = completedReadings;
  }
  
  // Load saved reading states on mount - optimize localStorage checks
  onMount(() => {
    // Batch localStorage operations
    for (const reading of allReadings) {
      const key = getReadingKey(reading);
      if (localStorage.getItem(key) === 'completed') {
        completedReadings.add(key);
      }
    }
    
    // Trigger reactivity once
    completedReadings = completedReadings;
  });
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
    <div class="bg-base-100 rounded-lg overflow-hidden border-2">
      {#each Object.entries(readingGroups) as [source, readings], index}
        <div >
          <div class="bg-base-200 px-6 py-3">
            <h2 class="font-roboto font-bold text-lg text-neutral uppercase">{source}</h2>
          </div>
          
          <ul class="divide-y divide-base-300">
            {#each readings as reading}
              <!-- Apply a subtle background when reading is completed -->
              <li class={`p-6 hover:bg-base-200 transition-all duration-300 relative ${
                completedReadings.has(getReadingKey(reading)) 
                  ? 'bg-sage-50 border-l-4 border-sage-400' 
                  : ''
              }`} style={!completedReadings.has(getReadingKey(reading)) ? "border-left: 4px solid transparent;" : ""}>
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-roboto font-bold text-lg text-neutral flex items-center gap-2">
                      {#if completedReadings.has(getReadingKey(reading))}
                        <span class="text-sage-600">
                          <BookOpenCheck class="w-5 h-5" />
                        </span>
                      {/if}
                      <span class={completedReadings.has(getReadingKey(reading)) ? "text-sage-800" : "text-neutral"}>
                        {reading.title}
                      </span>
                     
                      
                      
                    </h3>
                    {#if reading.author}
                    <span class="text-neutral block font-normal text-xs mt-1 font-archivo">by {reading.author}</span>
                  {/if}
                    <div class="flex items-start gap-2 flex-col mt-2 text-sm font-bold font-archivo" 
                      class:text-sage-700={completedReadings.has(getReadingKey(reading))}
                      class:text-neutral={!completedReadings.has(getReadingKey(reading))}>
                      {#if reading.pages}
                        <span class="mr-4">Pages: {reading.pages}</span>
                      {/if}
                      
                      {#if reading.readingTime}
                        <span class="mr-4">Reading Time: {reading.readingTime} minutes</span>
                      {/if}
                      
                      {#if reading.path}
                        <a href={reading.path} class="text-blue hover:text-purple mr-4 flex items-center font-bold">
                          <span>{reading.path}</span>
                        </a>
                      {/if}
                    </div>
                  </div>
                  
                  <div class="flex space-x-2">
                    <button
                      on:click={() => toggleReadingCompletion(reading)}
                      class={`p-2 rounded-md   no-wrap transition-all duration-300 flex items-center gap-1 ${
                        completedReadings.has(getReadingKey(reading)) 
                          ? 'bg-sage text-neutral  border-2 border-neutral shadow-inner' 
                          : 'bg-base-200 text-neutral hover:bg-sage-50 border-2 border-neutral hover:border-sage-300'
                      }`}
                      aria-label={completedReadings.has(getReadingKey(reading)) ? "Mark as unread" : "Mark as read"}
                    >
                    {#if completedReadings.has(getReadingKey(reading))}
                      <Check class="w-5 h-5" />
                    {/if}
                      <span class="font-archivo no-wrap text-sm">{completedReadings.has(getReadingKey(reading)) ? "Read" : "Mark read"}</span>
                    </button>
                    
                    {#if reading.url}
                      <a 
                        href={reading.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="p-2 rounded-md bg-base-200 text-neutral hover:bg-blue hover:text-white transition-colors border-2 border-neutral btn-drop-shadow flex items-center gap-1"
                        aria-label="Open reading resource"
                      >
                        <ExternalLink class="w-5 h-5" />
                        <span class="font-archivo text-sm">Open</span>
                      </a>
                    {/if}
                  </div>
                </div>
                
             
                <!-- Reading-specific confetti -->
                {#if confettiForReading && confettiForReading.title === reading.title}
                  <div 
                    use:confetti={{
                      particleCount: 50,
                      force: 0.5,
                      colors: ['#FFD700', '#FFA500', '#FF4500', '#008000', '#4169E1']
                    }}
                    class="absolute inset-0 pointer-events-none z-10"
                  ></div>
                {/if}
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