<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import { ArrowLeft, Menu, X, BookOpen, Clipboard } from 'lucide-svelte';
  import CourseMenu from './CourseMenu.svelte';
  
  type MenuDataType = Record<string, any>;
  
  export let menuData: MenuDataType = {};
  export let availableCourses: string[] = ['cdv2025', 'cs201'];
  
  // Get current course from URL or default to first available
  const courseIdFromUrl = $page.params.courseId || '';
  const selectedCourse = writable<string>(
    availableCourses.includes(courseIdFromUrl) 
      ? courseIdFromUrl 
      : availableCourses[0]
  );
  
  // Reactive variable to extract current day's content if available
  $: currentDayContent = $page.data?.content?.metadata || null;
  
  // Track if menu is open (for mobile)
  const isMenuOpen = writable<boolean>(false);
  
  // Toggle menu in mobile view
  function toggleMenu(): void {
    $isMenuOpen = !$isMenuOpen;
  }
  
  // Close menu when changing pages (for mobile)
  $: if ($page.url) {
    $isMenuOpen = false;
  }
  
  // Handle course selection change
  function handleCourseChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newCourse = target.value;
    $selectedCourse = newCourse;
    
    // Redirect to the new course's main page using SvelteKit navigation
    const baseUrl = `/${newCourse}`;
    goto(baseUrl);
  }
  
  // Extract readings and assignments from current page data if available
  $: currentCourseData = $selectedCourse ? menuData[$selectedCourse] || {} : {};
  
  // Combine course readings and current page readings if both exist
  $: combinedMenuData = {
    ...currentCourseData,
    readings: [
      ...(currentCourseData.readings || []),
      // If current page has readings, add those too
      ...(currentDayContent?.readings || [])
    ],
    assignments: [
      ...(currentCourseData.assignments || []),
      // If current page has assignments, add those too
      ...(currentDayContent?.assignments || [])
    ]
  };
</script>

<div class="flex min-h-screen flex-col md:flex-row">
  <!-- Mobile header with menu toggle -->
  <div class="sticky top-0 z-10 flex items-center justify-between bg-white p-4 md:hidden">
    <button 
      on:click={toggleMenu} 
      class="rounded border border-gray-300 p-2 text-gray-500"
      aria-label="Toggle menu"
    >
      {#if $isMenuOpen}
        <X class="h-5 w-5" />
      {:else}
        <Menu class="h-5 w-5" />
      {/if}
    </button>
    
    <!-- Course selector in header on mobile -->
    <div class="flex items-center ml-4">
      <button on:click={() => goto('/')} class="bg-base-200 w-full flex items-center text-neutral group justify-center text-white py-2 px-4 rounded font-medium text-center transition-colors hover:bg-purple">
        <ArrowLeft class="w-4 h-4 stroke-neutral group-hover:stroke-white" />  <span class="ml-2 font-archivo text-base-300 group-hover:text-white">Back</span>
      </button>
    </div>
  </div>

  <!-- Sidebar - fixed on desktop, slides in on mobile -->
  <aside 
    class={`fixed inset-y-0 left-0 z-20 w-64 transform bg-white p-4 shadow-lg transition-transform duration-300 ${$isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 md:shadow-none md:border-r border-gray-200`}
  >
    <div class="hidden md:block mb-4">
      <button on:click={() => goto('/')} class="bg-base-200 w-full flex group items-center text-base-300 justify-center text-white py-2 px-4 rounded font-medium text-center transition-colors hover:bg-purple">
        <ArrowLeft class="w-4 h-4 stroke-base-300 group-hover:stroke-white" />  <span class="group-hover:text-white ml-2 font-archivo text-base-300">Back</span>
      </button>
    </div>
    
    <!-- Quick resource navigation links -->
    {#if $selectedCourse}
      <div class="flex justify-between gap-2 mb-6 mt-2">
        <a 
          href="/{$selectedCourse}/readings" 
          class="flex-1 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded font-archivo text-sm transition-colors"
        >
          <BookOpen class="w-4 h-4 mr-1" />
          <span>Readings</span>
        </a>
        <a 
          href="/{$selectedCourse}/assignments" 
          class="flex-1 flex items-center justify-center bg-green-50 hover:bg-green-100 text-green-700 py-2 px-3 rounded font-archivo text-sm transition-colors"
        >
          <Clipboard class="w-4 h-4 mr-1" />
          <span>Assignments</span>
        </a>
      </div>
    {/if}
    
    <!-- Use our enhanced CourseMenu component with combined data -->
    {#if menuData[$selectedCourse]}
      <CourseMenu 
        courseId={$selectedCourse} 
        menuData={combinedMenuData} 
      />
    {/if}
  </aside>

  <!-- Main content area -->
  <main class="flex-1 p-6 md:p-8">
    <slot />
  </main>
  
  <!-- Overlay for mobile menu (shown when menu is open) -->
  {#if $isMenuOpen}
    <div 
      class="fixed inset-0 z-10 bg-black bg-opacity-20 md:hidden" 
      on:click={() => ($isMenuOpen = false)} 
      aria-hidden="true"
    ></div>
  {/if}
</div> 