<script lang="ts">
  import { page } from '$app/stores';
  import { Clipboard, Calendar, ExternalLink, Check, Clock } from 'lucide-svelte';
  import { onMount, onDestroy } from 'svelte';
  import { assignmentStore } from '$lib/stores/assignments';
  import { browser } from '$app/environment';
  
  // Define types for clarity
  interface Assignment {
    title: string;
    due?: string;
    description?: string;
    path?: string;
    source?: string;
    id?: string; // Assignment ID for matching
  }
  
  // Get course ID from URL params
  $: courseId = $page.params.courseId;
  
  // Get assignments from the page data
  // This assumes the +page.server.js or +page.ts load function aggregates assignments
  // from all content files and provides them in the page data
  $: allAssignments = ($page.data?.assignments || []) as Assignment[];
  
  onMount(() => {
    if (browser) {
      // Initialize the store for this course
      assignmentStore.initCourse(courseId);
    }
  });
  
  // Check if an assignment is completed
  function isAssignmentDone(assignment: Assignment): boolean {
    // Get the assignment ID - either from the id property or derive from path or title
    const id = getAssignmentId(assignment);
    if (!id) return false;
    
    // Check the store
    return !!$assignmentStore[`${courseId}:${id}`];
  }
  
  // Extract assignment ID from the assignment object
  function getAssignmentId(assignment: Assignment): string | null {
    // If we have an explicit ID, use it
    if (assignment.id) return assignment.id;
    
    // Otherwise try to extract from path
    if (assignment.path) {
      const pathMatch = assignment.path.match(/\/([^\/]+)$/);
      if (pathMatch && pathMatch[1]) {
        return pathMatch[1];
      }
    }
    
    // Fall back to using the title
    if (assignment.title) {
      return assignment.title.replace(/\s+/g, '_');
    }
    
    return null;
  }
  
  // Group assignments by due date
  $: assignmentsByDue = groupAssignmentsByDueDate(allAssignments);
  
  // Sort the due dates
  $: sortedDueDates = Object.keys(assignmentsByDue).sort((a, b) => {
    if (a === 'No Due Date') return 1;
    if (b === 'No Due Date') return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  });
  
  // Group assignments by due date
  function groupAssignmentsByDueDate(assignments: Assignment[]): Record<string, Assignment[]> {
    return assignments.reduce((groups: Record<string, Assignment[]>, assignment: Assignment) => {
      const due = assignment.due || 'No Due Date';
      if (!groups[due]) {
        groups[due] = [];
      }
      groups[due].push(assignment);
      return groups;
    }, {});
  }
</script>

<svelte:head>
  <title>Assignments | {courseId.toUpperCase()}</title>
  <meta name="description" content="Course assignments for {courseId.toUpperCase()}">
</svelte:head>

<div class="max-w-4xl mx-auto relative">
  <div class="noise-bg absolute top-0 left-0 w-full h-full pointer-events-none"></div>
  <div class="content-wrapper relative z-10">
    <!-- Header -->
    <div class="mb-8 border-b-2 border-neutral pb-4">
      <h1 class="text-4xl font-libre-caslon mb-2 flex items-center text-neutral">
        <Clipboard class="w-8 h-8 mr-3 text-sage" />
        Course Assignments
      </h1>
     

      <p class="text-neutral text-red mt-4 font-archivo">
       Unless stated otherwise, all assignments are due at 9:00pm on the due date. <br/> After this, your assignment will be considered late and penalties will be applied.
    </div>

    
    {#if sortedDueDates.length === 0}
      <div class="bg-base-200 rounded-lg p-8 text-center border-2 border-neutral btn-drop-shadow">
        <p class="text-neutral font-archivo font-bold">No assignments have been added to this course yet.</p>
        <a href="/{courseId}" class="inline-block mt-4 bg-sage hover:bg-purple text-white font-roboto font-bold px-4 py-2 rounded-md border-2 border-neutral btn-drop-shadow uppercase transition-colors">
          Return to Course
        </a>
      </div>
    {:else}
      <!-- Assignment List grouped by due date -->
      <div class="bg-base-100 rounded-lg overflow-hidden border-2 border-neutral btn-drop-shadow">
        {#each sortedDueDates as dueDate, index}
          <div class={`${index > 0 ? 'border-t-2 border-base-300' : ''}`}>
            <div class="bg-base-200 px-6 py-3 flex items-center">
              <Calendar class="w-5 h-5 mr-2 text-sage" />
              <h2 class="font-roboto font-bold text-lg text-neutral uppercase">
                {dueDate === 'No Due Date' ? dueDate : new Date(dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h2>
            </div>
            
            <ul class="divide-y divide-base-300">
              {#each assignmentsByDue[dueDate] as assignment}
                <li class="p-6 hover:bg-base-200 transition-colors">
                  <div>
                    <div class="flex justify-between">
                      <h3 class="font-libre-caslon font-bold text-lg text-neutral">
                        
                        {assignment.title}
                      </h3>
                    </div>
                    
                    {#if assignment.description}
                      <p class="text-neutral mt-1 font-archivo">{assignment.description}</p>
                    {/if}
                    
                    <div class="mt-4 flex items-center justify-between flex-wrap gap-2">
                      {#if assignment.path}
                        <a 
                          href="{assignment.path}"
                          class="bg-blue hover:bg-neutral text-white py-2 px-4 rounded-md border-2 border-neutral btn-drop-shadow font-roboto font-bold text-sm uppercase transition-colors flex items-center"
                        >
                          <span>View Assignment</span>
                          <ExternalLink class="w-3 h-3 ml-2" />
                        </a>
                      {/if}
                      {#if !isAssignmentDone(assignment)}
                      <div class="text-neutral">
                        <Clock class="size-5 mt-2" />
                      </div>
                      {:else}
                      <div class="bg-sage text-white rounded-full p-2">
                        <Check class="size-5" />
                      </div>
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
</div>

<style>
  .noise-bg {
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 245 245' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='8.51' numOctaves='10' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    mix-blend-mode: overlay;
    opacity: 1;
    z-index: 1;
  }
</style> 