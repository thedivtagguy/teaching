<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import MDLayout from '$lib/components/MDLayout.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import { Calendar, ArrowLeft, CheckCircle } from 'lucide-svelte';
  import { confetti } from '@neoconfetti/svelte';
  import { assignmentStore, type AssignmentWithStatus } from '$lib/stores/assignments';
  import { browser } from '$app/environment';
  
  // Get course ID and assignment ID from URL params
  $: courseId = $page.params.courseId;
  $: assignmentId = $page.params.assignmentId;
  
  // Get the assignment content from the page data
  $: assignment = $page.data?.assignment;
  $: loadError = $page.data?.error;
  $: loadedMeta = $page.data?.meta || {};
  
  // State for confetti
  let showConfetti = false;
  let confettiElement: HTMLElement;
  
  onMount(() => {
    if (browser) {
      // Initialize the store for this course
      assignmentStore.initCourse(courseId);
      
      // If we have loaded metadata, add it to the store
      if (loadedMeta) {
        assignmentStore.setAssignments(courseId, [{
          id: assignmentId,
          title: loadedMeta?.title || 'Assignment',
          due: loadedMeta?.due,
          description: loadedMeta?.description,
          points: loadedMeta?.points
        }]);
      }
    }
  });
  
  // Track our assignment data with status
  let assignmentWithStatus: AssignmentWithStatus | undefined;
  
  // Subscribe to the assignments store to get real-time updates
  $: {
    const unsubscribe = assignmentStore.assignments.subscribe(data => {
      assignmentWithStatus = data[courseId]?.[assignmentId];
    });
  }
  
  // Use the store data or fallback to loaded data
  $: title = assignmentWithStatus?.title || loadedMeta?.title || 'Assignment';
  $: due = assignmentWithStatus?.due || loadedMeta?.due;
  $: description = assignmentWithStatus?.description || loadedMeta?.description;
  $: points = assignmentWithStatus?.points || loadedMeta?.points;
  $: isCompleted = assignmentWithStatus?.completed || false;
  
  function submitAssignment() {
    if (!browser || !assignmentId) return;
    
    // Toggle completion state and get the new state
    const newState = assignmentStore.toggleCompletion(courseId, assignmentId);
    
    // Show confetti only when marking as completed (not when unmarking)
    if (newState) {
      showConfetti = true;
      setTimeout(() => showConfetti = false, 3000);
    }
  }
</script>

<SEO 
  title={title}
  description={description}
  courseId={courseId}
  contentType="assignment"
  date={due}
/>

<div class="max-w-3xl overflow-hidden relative mx-auto">
  <!-- Back to course link -->
  <div class="mb-6">
    <a href="/{courseId}/assignments" class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
      <ArrowLeft class="w-4 h-4 mr-2" />
      <span class="font-archivo">Back to assignments</span>
    </a>
  </div>
  
  {#if loadError}
    <div class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 mb-6 shadow-sm">
      <p class="font-archivo text-lg">{loadError}</p>
    </div>
  {:else if assignment}
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- Assignment header -->
      <div class="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-sage-50 p-6">
        <h1 class="text-2xl font-libre-caslon mb-3">
          {title}
        </h1>
        
        <div class="flex flex-wrap w-full gap-4 text-sm">
          {#if due}
            <div class="flex items-center bg-white px-3 py-1 rounded-full shadow-sm border border-red-100">
              <Calendar class="w-4 h-4 mr-2 text-red-500" />
              <span class="font-archivo text-red-600">Due: {due}</span>
            </div>
          {/if}
          
          {#if points}
            <div class="flex items-center bg-white px-3 py-1 rounded-full shadow-sm border border-blue-100">
              <span class="font-archivo text-blue-600">Points: {points}</span>
            </div>
          {/if}
          
          {#if isCompleted}
            <div class="flex items-center bg-sage-100 px-3 py-1 rounded-full shadow-sm border border-sage-200">
              <CheckCircle class="w-4 h-4 mr-1 text-sage-600" />
              <span class="font-archivo text-sage-700">Completed</span>
            </div>
          {/if}

          <div class="ml-auto">
            <button 
              on:click={submitAssignment}
              class={`${isCompleted ? 'bg-sage text-neutral' : 'bg-blue text-white'} py-2 px-4 rounded font-archivo transition-colors`}
            >
              {isCompleted ? 'Mark as Unsubmitted' : 'Mark as Submitted'}
            </button>
           
          </div>
        </div>
      </div>
      
      <!-- Assignment description -->
      <div class="p-6">
        {#if description}
          <div class="mb-6 font-archivo text-gray-700 text-lg border-l-4 border-blue-200 pl-4 py-2 bg-blue-50 rounded-r-md">
            {description}
          </div>
        {/if}
        
        <!-- Main assignment content -->
        <MDLayout>
          <svelte:component this={assignment} />
        </MDLayout>
      </div>
      
     
    </div>
  {:else}
    <div class="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
      <div class="animate-pulse text-gray-400 font-archivo flex flex-col items-center">
        <div class="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
        <div>Loading assignment...</div>
      </div>
    </div>
  {/if}

  <!-- Confetti container -->
{#if showConfetti}
<div 
  bind:this={confettiElement}
  use:confetti={{
    particleCount: 100,
    force: 0.6,
    colors: ['#FFD700', '#FFA500', '#FF4500', '#008000', '#4169E1']
  }}
  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] pointer-events-none z-50"
></div>
{/if} 
</div>

