<script lang="ts">
  import { page } from '$app/stores';
  import { BookOpen, ExternalLink, Check, BookOpenCheck, Clock, FileText } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { confetti } from '@neoconfetti/svelte';
  import { fly, fade } from 'svelte/transition';
  
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
  
  // Calculate overall progress
  $: totalReadings = allReadings.length;
  $: completedCount = allReadings.filter(reading => 
    completedReadings.has(getReadingKey(reading))).length;
  $: progressPercentage = totalReadings > 0 
    ? Math.round((completedCount / totalReadings) * 100) 
    : 0;
  
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

<div class="max-w-4xl mx-auto noise-image px-4 md:px-0 pb-16">
  <!-- Header with progress indicator -->
  <div class="mb-8 border-b-2 border-neutral pb-6 pt-4">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-4xl font-libre-caslon mb-2 flex items-center text-neutral">
          <BookOpen class="w-8 h-8 mr-3 text-blue" />
          <span class="relative">
            Readings
            <span class="absolute -bottom-1 left-0 w-full h-[3px] bg-yellow"></span>
          </span>
        </h1>
        <p class="text-lg text-base-300 font-archivo">
          All required and recommended readings for {courseId.toUpperCase()}.
        </p>
      </div>
      
      <!-- Progress indicator -->
      {#if totalReadings > 0}
        <div class="bg-base-200 rounded-lg p-3 border-2 border-neutral btn-drop-shadow">
          <div class="flex items-center gap-3">
            <div class="text-right">
              <p class="text-sm font-bold font-archivo uppercase text-neutral">Progress</p>
              <p class="text-lg font-bold font-roboto text-blue">{completedCount}/{totalReadings}</p>
            </div>
            <div class="w-24 h-6 bg-base-100 rounded-full overflow-hidden border-2 border-neutral">
              <div 
                class="h-full bg-sage transition-all duration-500 ease-out" 
                style="width: {progressPercentage}%"
              ></div>
            </div>
            <p class="font-bold font-archivo text-neutral">{progressPercentage}%</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
  
  {#if Object.keys(readingGroups).length === 0}
    <div class="bg-base-200 rounded-lg p-8 text-center border-2 border-neutral btn-drop-shadow">
      <p class="text-neutral font-archivo font-bold">No readings have been assigned for this course yet.</p>
      <a href="/{courseId}" class="inline-block mt-6 bg-blue hover:bg-purple text-white font-roboto font-bold px-6 py-2 rounded-md border-2 border-neutral btn-drop-shadow uppercase transition-colors">
        Return to Course
      </a>
    </div>
  {:else}
    <!-- Reading List -->
    <div class="space-y-8">
      {#each Object.entries(readingGroups) as [source, readings], index}
        <div in:fly={{y: 20, duration: 300, delay: index * 100}} class="bg-base-100 rounded-lg overflow-hidden border-2 border-neutral btn-drop-shadow">
          <div class="bg-base-200 px-6 py-3 border-b-2 border-neutral">
            <h2 class="font-roboto font-bold text-lg text-neutral uppercase tracking-wide">{source}</h2>
          </div>
          
          <ul class="divide-y divide-base-300">
            {#each readings as reading, readingIndex}
              <!-- Apply a subtle background when reading is completed -->
              <li 
                in:fade={{duration: 300, delay: readingIndex * 50}}
                class={`p-6 transition-all duration-300 relative group ${
                  completedReadings.has(getReadingKey(reading)) 
                    ? 'bg-sage bg-opacity-10 border-l-4 border-sage' 
                    : 'hover:bg-base-200'
                }`} 
                style={!completedReadings.has(getReadingKey(reading)) ? "border-left: 4px solid transparent;" : ""}
              >
                <div class="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div class="flex-1">
                    <h3 class="font-roboto font-bold text-xl text-neutral flex items-center gap-2 mb-1">
                     
                      <span class={completedReadings.has(getReadingKey(reading)) ? "text-sage-800" : "text-neutral"}>
                        {reading.title}
                      </span>
                    </h3>
                    
                    {#if reading.author}
                      <span class="text-neutral block font-normal text-sm mt-1 font-archivo italic opacity-75">by {reading.author}</span>
                    {/if}
                    
                    <div class="flex flex-wrap items-center gap-4 mt-3 text-sm font-archivo" 
                      class:text-sage-700={completedReadings.has(getReadingKey(reading))}
                      class:text-neutral={!completedReadings.has(getReadingKey(reading))}>
                      
                      {#if reading.pages}
                        <span class="flex items-center gap-1">
                          <FileText class="w-4 h-4" />
                          <span>{reading.pages} pages</span>
                        </span>
                      {/if}
                      
                      {#if reading.readingTime}
                        <span class="flex items-center gap-1">
                          <Clock class="w-4 h-4" />
                          <span>{reading.readingTime} min</span>
                        </span>
                      {/if}
                      
                      {#if reading.path}
                        <a href={reading.path} class="{ completedReadings.has(getReadingKey(reading)) ? 'text-neutral' : 'text-blue'} hover:text-purple flex items-center font-bold underline underline-offset-2 hover:no-underline">
                          <span>{reading.path}</span>
                        </a>
                      {/if}
                    </div>
                  </div>
                  
                  <div class="flex flex-wrap gap-2 mt-1 md:mt-0">
                    <button
                      on:click={() => toggleReadingCompletion(reading)}
                      class={`px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1 active:translate-y-0 ${
                        completedReadings.has(getReadingKey(reading)) 
                          ? 'bg-sage text-white border-2 border-neutral shadow-inner' 
                          : 'bg-base-200 text-neutral hover:bg-sage hover:text-white border-2 border-neutral'
                      }`}
                      aria-label={completedReadings.has(getReadingKey(reading)) ? "Mark as unread" : "Mark as read"}
                    >
                      {#if completedReadings.has(getReadingKey(reading))}
                        <Check class="w-5 h-5" />
                      {/if}
                      <span class="font-archivo text-sm font-bold">{completedReadings.has(getReadingKey(reading)) ? "Completed" : "Mark read"}</span>
                    </button>
                    
                    {#if reading.url}
                      <a 
                        href={reading.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="px-4 py-2 rounded-md bg-blue text-white hover:bg-purple transition-all border-2 border-neutral btn-drop-shadow flex items-center gap-2 transform hover:-translate-y-1 active:translate-y-0"
                        aria-label="Open reading resource"
                      >
                        <ExternalLink class="w-5 h-5" />
                        <span class="font-archivo text-sm font-bold">Open</span>
                      </a>
                    {/if}
                  </div>
                </div>
                
                <!-- Reading-specific confetti -->
                {#if confettiForReading && confettiForReading.title === reading.title}
                  <div 
                    use:confetti={{
                      particleCount: 75,
                      force: 0.7,
                      stageWidth: 800,
                      stageHeight: 400,
                      colors: ['#E8C85A', '#E8845A', '#4D80E6', '#92DE86', '#949B80']
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
</div> 