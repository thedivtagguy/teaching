<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import MDLayout from '$lib/components/MDLayout.svelte';
  import { Calendar, ArrowLeft, CheckCircle } from 'lucide-svelte';
  import { confetti } from '@neoconfetti/svelte';
  import { assignmentStore } from '$lib/stores/assignments';
  import { browser } from '$app/environment';
  
  // Get course ID and assignment ID from URL params
  $: courseId = $page.params.courseId;
  $: assignmentId = $page.params.assignmentId;
  
  let assignment: any = null;
  let error: string | null = null;
  
  // State for confetti
  let showConfetti = false;
  let confettiElement: HTMLElement;
  
  // Use a reactive statement to load assignment content
  $: {
    const loadAssignment = async () => {
      // Reset content and error when parameters change
      assignment = null;
      error = null;
      
      try {
        // Dynamically import the assignment based on course and assignment ID
        const module = await import(`../../../../content/${courseId}/assignments/${assignmentId}.svx`);
        assignment = module.default;
      } catch (err) {
        console.error(err);
        error = `Could not load assignment: ${assignmentId}`;
      }
    };
    
    // Call the function to load assignment
    loadAssignment();
  }
  
  // Initialize store for this course
  onMount(() => {
    if (browser) {
      assignmentStore.initCourse(courseId);
    }
  });
  
  // Reactive completion status from store
  $: isCompleted = $assignmentStore[`${courseId}:${assignmentId}`] || false;
  
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

<svelte:head>
  {#if assignment?.metadata?.title}
    <title>{assignment.metadata.title} | {courseId.toUpperCase()}</title>
  {:else}
    <title>Assignment | {courseId.toUpperCase()}</title>
  {/if}
</svelte:head>

<div class="max-w-3xl overflow-hidden relative mx-auto">
  <!-- Back to course link -->
  <div class="mb-6">
    <a href="/{courseId}/assignments" class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
      <ArrowLeft class="w-4 h-4 mr-2" />
      <span class="font-archivo">Back to assignments</span>
    </a>
  </div>
  
  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 mb-6 shadow-sm">
      <p class="font-archivo text-lg">{error}</p>
    </div>
  {:else if assignment}
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- Assignment header -->
      <div class="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-sage-50 p-6">
        <h1 class="text-2xl font-libre-caslon mb-3">
          {assignment.metadata?.title || 'Assignment'}
        </h1>
        
        <div class="flex flex-wrap gap-4 text-sm">
          {#if assignment.metadata?.due}
            <div class="flex items-center bg-white px-3 py-1 rounded-full shadow-sm border border-red-100">
              <Calendar class="w-4 h-4 mr-2 text-red-500" />
              <span class="font-archivo text-red-600">Due: {assignment.metadata.due}</span>
            </div>
          {/if}
          
          {#if assignment.metadata?.points}
            <div class="flex items-center bg-white px-3 py-1 rounded-full shadow-sm border border-blue-100">
              <span class="font-archivo text-blue-600">Points: {assignment.metadata.points}</span>
            </div>
          {/if}
          
          {#if isCompleted}
            <div class="flex items-center bg-sage-100 px-3 py-1 rounded-full shadow-sm border border-sage-200">
              <CheckCircle class="w-4 h-4 mr-1 text-sage-600" />
              <span class="font-archivo text-sage-700">Completed</span>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Assignment description -->
      <div class="p-6">
        {#if assignment.metadata?.description}
          <div class="mb-6 font-archivo text-gray-700 text-lg border-l-4 border-blue-200 pl-4 py-2 bg-blue-50 rounded-r-md">
            {assignment.metadata.description}
          </div>
        {/if}
        
        <!-- Main assignment content -->
        <MDLayout>
          <svelte:component this={assignment} />
        </MDLayout>
      </div>
      
      <!-- Assignment submission/actions -->
      <div class="py-6 bg-gray-50 border-t border-gray-100">
        <div class="flex flex-wrap gap-4 justify-end items-center">
          
          <div>
            <button 
              on:click={submitAssignment}
              class={`${isCompleted ? 'bg-sage text-neutral' : 'bg-blue text-white'} py-2 px-4 rounded font-archivo transition-colors`}
            >
              {isCompleted ? 'Mark as Unsubmitted' : 'Mark as Submitted'}
            </button>
           
          </div>
        </div>
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

