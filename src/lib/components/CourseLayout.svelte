<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import { ArrowLeft, Menu, X, BookOpen, Clipboard } from 'lucide-svelte';
  import CourseMenu from './CourseMenu.svelte';
  import type { MenuDataType, CourseMenu as CourseMenuType, Reading, Assignment } from '$lib/utils/contentSchema';
  
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
  $: currentCourseData = $selectedCourse ? menuData[$selectedCourse] as CourseMenuType || {} : {};
  
  // Combine course readings and current page readings if both exist
  $: combinedMenuData = {
    ...currentCourseData,
    readings: [
      ...(currentCourseData.readings || []),
      // If current page has readings, add those too
      ...((currentDayContent?.readings || []) as Reading[])
    ],
    assignments: [
      ...(currentCourseData.assignments || []),
      // If current page has assignments, add those too
      ...((currentDayContent?.assignments || []) as Assignment[])
    ]
  } as CourseMenuType;
</script>

<div class="flex min-h-screen flex-col md:flex-row bg-base-100">
  <!-- Mobile header with menu toggle -->
  <div class="sticky top-0 z-10 flex items-center justify-between bg-base-100 p-4 border-b border-base-300 md:hidden">
    <button 
      on:click={toggleMenu} 
      class="rounded-md border-2 border-neutral btn-drop-shadow p-2 text-neutral font-bold font-roboto"
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
      <button on:click={() => goto('/')} class="bg-base-200 flex items-center text-neutral group justify-center py-2 px-4 rounded-md border-2 border-neutral btn-drop-shadow font-roboto font-bold text-center transition-colors hover:bg-purple">
        <ArrowLeft class="w-4 h-4 stroke-neutral group-hover:stroke-white" />  <span class="ml-2 font-archivo text-neutral group-hover:text-white">Back</span>
      </button>
    </div>
  </div>

  <!-- Sidebar - fixed on desktop, slides in on mobile -->
  <aside 
    class={`fixed inset-y-0 left-0 z-20 w-68 transform bg-base-100 p-6 border-r border-base-300 transition-transform duration-300 ${$isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 md:shadow-none`}
  >
    <div class="hidden md:block mb-6">
      <button on:click={() => goto('/')} class="bg-base-200 w-full flex group items-center text-neutral justify-center py-2 px-4 rounded-md border-2 border-neutral btn-drop-shadow font-roboto font-bold text-center transition-colors hover:bg-purple">
        <ArrowLeft class="w-4 h-4 stroke-neutral group-hover:stroke-white" />  
        <span class="group-hover:text-white ml-2 font-roboto">Back</span>
      </button>
    </div>
    
    <!-- Use our enhanced CourseMenu component with combined data -->
    {#if menuData[$selectedCourse]}
      <CourseMenu 
        courseId={$selectedCourse} 
        menuData={combinedMenuData} 
        selectedCourse={$selectedCourse}
      />
    {/if}
  </aside>

  <!-- Main content area -->
  <main class="flex-1 p-6 md:p-8 noise-image">
    <slot />
  </main>
  
  <!-- Overlay for mobile menu (shown when menu is open) -->
  {#if $isMenuOpen}
    <div 
      class="fixed inset-0 z-10 bg-neutral bg-opacity-20 md:hidden" 
      on:click={() => ($isMenuOpen = false)} 
      aria-hidden="true"
    ></div>
  {/if}
</div> 