<script lang="ts">
  import { page } from '$app/stores';
  import { Clipboard, Calendar, ExternalLink } from 'lucide-svelte';
  
  // Define types for clarity
  interface Assignment {
    title: string;
    due?: string;
    description?: string;
    path?: string;
    source?: string;
  }
  
  // Get course ID from URL params
  $: courseId = $page.params.courseId;
  
  // Get assignments from the page data
  // This assumes the +page.server.js or +page.ts load function aggregates assignments
  // from all content files and provides them in the page data
  $: allAssignments = ($page.data?.assignments || []) as Assignment[];
  
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

<div class="max-w-4xl mx-auto">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-libre-caslon mb-2 flex items-center text-green-900">
      <Clipboard class="w-8 h-8 mr-3 text-green-600" />
      Course Assignments
    </h1>
    <p class="text-lg text-gray-700 font-archivo">
      All assignments for {courseId.toUpperCase()}.
    </p>
  </div>
  
  {#if sortedDueDates.length === 0}
    <div class="bg-green-50 rounded-lg p-8 text-center border border-green-100">
      <p class="text-green-800 font-archivo">No assignments have been added to this course yet.</p>
      <a href="/{courseId}" class="inline-block mt-4 bg-green-600 text-white font-archivo px-4 py-2 rounded hover:bg-green-700 transition-colors">
        Return to Course
      </a>
    </div>
  {:else}
    <!-- Assignment List grouped by due date -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      {#each sortedDueDates as dueDate, index}
        <div class={`${index > 0 ? 'border-t border-gray-100' : ''}`}>
          <div class="bg-green-50 px-6 py-3 flex items-center">
            <Calendar class="w-5 h-5 mr-2 text-green-600" />
            <h2 class="font-archivo font-semibold text-lg text-green-800">
              {dueDate === 'No Due Date' ? dueDate : new Date(dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
          </div>
          
          <ul class="divide-y divide-gray-100">
            {#each assignmentsByDue[dueDate] as assignment}
              <li class="p-6 hover:bg-green-50 transition-colors">
                <div>
                  <div class="flex justify-between">
                    <h3 class="font-archivo font-semibold text-lg text-gray-900">
                      {assignment.title}
                    </h3>
                    
                    {#if assignment.source}
                      <span class="text-xs text-gray-500 font-archivo bg-gray-100 px-2 py-1 rounded-full">
                        From: {assignment.source}
                      </span>
                    {/if}
                  </div>
                  
                  {#if assignment.description}
                    <p class="text-gray-700 mt-1">{assignment.description}</p>
                  {/if}
                  
                  <div class="mt-4 flex flex-wrap gap-2">
                    {#if assignment.path}
                      <a 
                        href={assignment.path} 
                        class="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm font-archivo inline-flex items-center transition-colors"
                      >
                        <span>View Assignment</span>
                        <ExternalLink class="w-3 h-3 ml-1" />
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