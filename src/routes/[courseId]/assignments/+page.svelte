<script lang="ts">
  import { page } from '$app/stores';
  import { Clipboard, Calendar, ExternalLink, Check, Clock, FileText, AlertTriangle } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { assignmentStore, type AssignmentMeta, type AssignmentWithStatus } from '$lib/stores/assignments';
  import { browser } from '$app/environment';
  import { fly, fade } from 'svelte/transition';
  
  // Get course ID from URL params
  $: courseId = $page.params.courseId;
  
  // Get assignments from the page data
  $: allAssignments = ($page.data?.assignments || []) as AssignmentMeta[];
  
  // Process assignments to ensure they all have IDs
  $: processedAssignments = allAssignments.map(assignment => {
    // If the assignment already has an ID, use it
    if (assignment.id) return assignment;
    
    // Otherwise create an ID from path or title
    let id = null;
    
    // Try to extract from path
    if (assignment.path) {
      const pathMatch = assignment.path.match(/\/([^\/]+)$/);
      if (pathMatch && pathMatch[1]) {
        id = pathMatch[1];
      }
    }
    
    // Fall back to using the title
    if (!id && assignment.title) {
      id = assignment.title.replace(/\s+/g, '_');
    }
    
    return {
      ...assignment,
      id: id || 'unknown'
    };
  });
  
  // Initialize the store on mount
  onMount(() => {
    if (browser) {
      // Initialize the store for this course
      assignmentStore.initCourse(courseId);
      
      // Add assignment metadata to the store
      assignmentStore.setAssignments(courseId, processedAssignments);
    }
  });
  
  // Track assignments with completion status
  let assignmentsWithStatus: Record<string, AssignmentWithStatus> = {};
  
  // Subscribe to the assignments store to get real-time updates
  $: {
    const unsubscribe = assignmentStore.assignments.subscribe(data => {
      assignmentsWithStatus = data[courseId] || {};
      // Recalculate completion count and percentage when the store updates
      updateProgressStats();
    });
  }
  
  // Track progress stats
  let completedCount = 0;
  let progressPercentage = 0;
  
  // Function to update progress stats
  function updateProgressStats() {
    if (processedAssignments.length === 0) return;
    
    completedCount = processedAssignments.filter(assignment => isAssignmentDone(assignment)).length;
    progressPercentage = Math.round((completedCount / processedAssignments.length) * 100);
  }
  
  // Check if an assignment is completed using the store data
  function isAssignmentDone(assignment: AssignmentMeta): boolean {
    // Try to get the assignment from the store
    const storeAssignment = assignmentsWithStatus[assignment.id];
    if (storeAssignment) {
      return storeAssignment.completed;
    }
    
    // Fallback to the direct method if not in store yet
    return browser ? assignmentStore.isCompleted(courseId, assignment.id) : false;
  }
  
  // Make totalAssignments reactive
  $: totalAssignments = processedAssignments.length;
  
  // Ensure progress is updated when processedAssignments change
  $: {
    if (Object.keys(assignmentsWithStatus).length > 0 && totalAssignments > 0) {
      updateProgressStats();
    }
  }
  
  // Group assignments by due date
  $: assignmentsByDue = groupAssignmentsByDueDate(processedAssignments);
  
  // Sort the due dates
  $: sortedDueDates = Object.keys(assignmentsByDue).sort((a, b) => {
    if (a === 'No Due Date') return 1;
    if (b === 'No Due Date') return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  });
  
  // Group assignments by due date
  function groupAssignmentsByDueDate(assignments: AssignmentMeta[]): Record<string, AssignmentMeta[]> {
    return assignments.reduce((groups: Record<string, AssignmentMeta[]>, assignment: AssignmentMeta) => {
      const due = assignment.due || 'No Due Date';
      if (!groups[due]) {
        groups[due] = [];
      }
      groups[due].push(assignment);
      return groups;
    }, {});
  }
  
  // Check if assignment is past due
  function isPastDue(dueDate: string): boolean {
    if (dueDate === 'No Due Date') return false;
    
    // If all assignments for this date are completed, don't mark as past due
    const assignmentsForDate = assignmentsByDue[dueDate] || [];
    const allCompleted = assignmentsForDate.length > 0 && 
      assignmentsForDate.every(assignment => isAssignmentDone(assignment));
    
    if (allCompleted) return false;
    
    const now = new Date();
    const due = new Date(dueDate);
    due.setHours(21, 0, 0, 0); // Set to 9:00 PM
    return now > due;
  }
  
  // Format date for display
  function formatDate(dateString: string): string {
    if (dateString === 'No Due Date') return dateString;
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
</script>

<svelte:head>
  <title>Assignments | {courseId.toUpperCase()}</title>
  <meta name="description" content="Course assignments for {courseId.toUpperCase()}">
</svelte:head>

<div class="max-w-4xl mx-auto noise-image px-4 md:px-0 pb-16">
  <!-- Header with progress indicator -->
  <div class="mb-8 border-b-2 border-neutral pb-6 pt-4">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-4xl font-libre-caslon mb-2 flex items-center text-neutral">
          <Clipboard class="w-8 h-8 mr-3 text-sage" />
          <span class="relative">
            Course Assignments
            <span class="absolute -bottom-1 left-0 w-full h-[3px] bg-yellow"></span>
          </span>
        </h1>
        <p class="text-red mt-4 font-archivo font-medium">
          Unless stated otherwise, all assignments are due at 10:00pm on the due date.
          <span class="block mt-1">After this, your assignment will be considered late and penalties will be applied.</span>
        </p>
      </div>
      
      <!-- Progress indicator -->
      {#if totalAssignments > 0}
        <div class="bg-base-200 rounded-lg p-3 border-2 border-neutral btn-drop-shadow">
          <div class="flex items-center gap-3">
            <div class="text-right">
              <p class="text-sm font-bold font-archivo uppercase text-neutral">Progress</p>
              <p class="text-lg font-bold font-roboto text-sage">{completedCount}/{totalAssignments}</p>
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
  
  {#if sortedDueDates.length === 0}
    <div class="bg-base-200 rounded-lg p-8 text-center border-2 border-neutral btn-drop-shadow">
      <p class="text-neutral font-archivo font-bold">No assignments have been added to this course yet.</p>
      <a href="/{courseId}" class="inline-block mt-6 bg-sage hover:bg-purple text-white font-roboto font-bold px-6 py-2 rounded-md border-2 border-neutral btn-drop-shadow uppercase transition-colors">
        Return to Course
      </a>
    </div>
  {:else}
    <!-- Assignment List grouped by due date -->
    <div class="space-y-8">
      {#each sortedDueDates as dueDate, index}
        <div 
          in:fly={{y: 20, duration: 300, delay: index * 100}} 
          class="bg-base-100 rounded-lg overflow-hidden border-2 border-neutral btn-drop-shadow"
        >
          <div class={`bg-base-200 px-6 py-3 flex items-center border-b-2 border-neutral ${isPastDue(dueDate) && dueDate !== 'No Due Date' ? 'bg-red bg-opacity-10' : ''}`}>
            <Calendar class={`w-5 h-5 mr-2 ${isPastDue(dueDate) && dueDate !== 'No Due Date' ? 'text-red' : 'text-sage'}`} />
            <div class="flex-1">
              <h2 class="font-roboto font-bold text-lg text-neutral uppercase tracking-wide">
                {formatDate(dueDate)}
              </h2>
              {#if isPastDue(dueDate) && dueDate !== 'No Due Date'}
                <p class="text-red text-sm font-archivo font-bold flex items-center gap-1 mt-0.5">
                  <AlertTriangle class="w-3 h-3" />
                  <span>Past due</span>
                </p>
              {/if}
            </div>
          </div>
          
          <ul class="divide-y divide-base-300">
            {#each assignmentsByDue[dueDate] as assignment, assIndex}
              <li 
                in:fade={{duration: 300, delay: assIndex * 50}}
                class={`p-6 transition-all duration-300 relative group ${
                  isAssignmentDone(assignment) 
                    ? 'bg-sage bg-opacity-10 border-l-4 border-sage' 
                    : 'hover:bg-base-200'
                }`} 
                style={!isAssignmentDone(assignment) ? "border-left: 4px solid transparent;" : ""}
              >
                <div class="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div class="flex-1">
                    <h3 class={`font-libre-caslon font-bold text-xl ${isAssignmentDone(assignment) ? 'text-sage-800' : 'text-neutral'}`}>
                      {assignment.title}
                    </h3>
                    
                    {#if assignment.description}
                      <p class="text-neutral mt-2 font-archivo">{assignment.description}</p>
                    {/if}
                    
                    {#if assignment.points}
                      <div class="mt-3 flex items-center gap-2">
                        <FileText class="w-4 h-4 text-neutral" />
                        <span class="text-sm font-archivo font-bold">{assignment.points} points</span>
                      </div>
                    {/if}
                  </div>
                  
                  <div class="flex flex-wrap gap-2 mt-1 md:mt-0">
                    {#if assignment.path}
                      <a 
                        href="{assignment.path}"
                        class="px-4 py-2 rounded-md bg-blue text-white hover:bg-purple transition-all border-2 border-neutral btn-drop-shadow flex items-center gap-2 transform hover:-translate-y-1 active:translate-y-0"
                        aria-label="View assignment details"
                      >
                        <span class="font-archivo text-sm font-bold">View Assignment</span>
                        <ExternalLink class="w-4 h-4" />
                      </a>
                    {/if}
                    
                    <div class={`px-4 py-2 rounded-md border-2 border-neutral flex items-center gap-2 font-archivo text-sm font-bold ${
                      isAssignmentDone(assignment) 
                        ? 'bg-sage text-white' 
                        : 'bg-base-200 text-neutral'
                    }`}>
                      {#if isAssignmentDone(assignment)}
                        <Check class="w-4 h-4" />
                        <span>Completed</span>
                      {:else}
                        <Clock class="w-4 h-4" />
                        <span>Pending</span>
                      {/if}
                    </div>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
    
    <!-- Back to course - uncomment if needed -->
    <!-- <div class="mt-8 flex justify-center">
      <a 
        href="/{courseId}" 
        class="px-6 py-3 bg-base-200 text-neutral font-roboto font-bold rounded-md hover:bg-neutral hover:text-white transition-colors border-2 border-neutral btn-drop-shadow uppercase transform hover:-translate-y-1 active:translate-y-0"
      >
        Back to Course
      </a>
    </div> -->
  {/if}
</div>

<style>
  .noise-bg {
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 245 245' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='8.51' numOctaves='10' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    mix-blend-mode: overlay;
    opacity: 1;
    z-index: 1;
  }
</style> 