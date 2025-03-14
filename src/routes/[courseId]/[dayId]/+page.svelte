<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  
  // Get course ID and day ID from URL params
  $: courseId = $page.params.courseId;
  $: dayId = $page.params.dayId;
  
  let content: any = null;
  let error: string | null = null;
  
  // Use a reactive statement instead of onMount to load content
  // This will re-run whenever courseId or dayId changes
  $: {
    const loadContent = async () => {
      // Reset content and error when parameters change
      content = null;
      error = null;
      
      try {
        // Dynamically import the content based on course and day
        const module = await import(`../../../content/${courseId}/${dayId}.svx`);
        content = module.default;
      } catch (err) {
        error = `Could not load content for ${courseId}/${dayId}`;
        console.error(err);
      }
    };
    
    // Call the function to load content
    loadContent();
  }
</script>

<div class="max-w-3xl">
  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
      <p class="font-archivo">{error}</p>
      <p class="mt-2">
        <a href="/{courseId}" class="text-blue hover:underline">Return to course page</a>
      </p>
    </div>
  {:else if content}
    <!-- Frontmatter data display -->
    <div class="mb-8">
      <h1 class="text-3xl font-libre-caslon mb-2">{content.metadata?.title || `${dayId.charAt(0).toUpperCase() + dayId.slice(1)}`}</h1>
      {#if content.metadata?.date}
        <p class="text-gray-600 mb-4 font-archivo">{content.metadata.date}</p>
      {/if}
      {#if content.metadata?.description}
        <p class="text-lg mb-6 font-archivo">{content.metadata.description}</p>
      {/if}
    </div>

    <!-- Course content -->
    <div class="bg-white mb-8 prose prose-blue max-w-none">
      <svelte:component this={content} />
    </div>

    <!-- Readings section -->
    {#if content.metadata?.readings && content.metadata.readings.length > 0}
      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-libre-caslon mb-4">Readings</h2>
        <ul class="space-y-3">
          {#each content.metadata.readings as reading}
            <li class="font-archivo">
              <span class="font-semibold">{reading.title}</span> 
              {#if reading.author} by {reading.author}{/if}
              {#if reading.pages} (pp. {reading.pages}){/if}
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    <!-- Assignments section -->
    {#if content.metadata?.assignments && content.metadata.assignments.length > 0}
      <div class="bg-gray-50 rounded-lg p-6">
        <h2 class="text-xl font-libre-caslon mb-4">Assignments</h2>
        <ul class="space-y-4">
          {#each content.metadata.assignments as assignment}
            <li class="font-archivo">
              <div class="font-semibold">{assignment.title}</div>
              {#if assignment.due}<div class="text-sm text-gray-600">Due: {assignment.due}</div>{/if}
              {#if assignment.description}<div class="mt-1">{assignment.description}</div>{/if}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  {:else}
    <div class="flex justify-center items-center h-32">
      <div class="animate-pulse text-gray-400 font-archivo">Loading content...</div>
    </div>
  {/if}
</div> 