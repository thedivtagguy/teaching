<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import { Menu, X } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils/index.js';
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

<div class="flex min-h-screen flex-col md:flex-row bg-background">
  <!-- Mobile header with menu toggle -->
  <div class="sticky top-0 z-[var(--z-docked)] flex items-center justify-between bg-background p-4 border-b border-border md:hidden">
    <Button 
      on:click={toggleMenu} 
      variant="outline"
      size="icon"
      class={cn(
        "border-2 border-foreground",
        "shadow-[var(--shadow-btn-drop)] transition-all duration-[var(--duration-250)]",
        "hover:shadow-[var(--shadow-btn-hover)] hover:-translate-y-0.5",
        "font-roboto font-bold"
      )}
      aria-label="Toggle menu"
    >
      {#if $isMenuOpen}
        <X class="h-5 w-5" />
      {:else}
        <Menu class="h-5 w-5" />
      {/if}
    </Button>
    
   
  </div>

  <!-- Sidebar - fixed on desktop, slides in on mobile -->
  <aside 
    class={cn(
      "fixed inset-y-0 left-0 transform bg-background p-6 border-r border-border transition-transform",
      "w-[var(--sidebar-default)] z-[var(--z-dropdown)]",
      "duration-[var(--duration-300)] ease-[var(--ease-in-out)]",
      $isMenuOpen ? 'translate-x-0' : '-translate-x-full',
      "md:static md:translate-x-0 md:shadow-none"
    )}
  >
    
    
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
  <main class="flex-1 p-6 md:p-8 noise-image bg-background">
    <slot />
  </main>
  
  <!-- Overlay for mobile menu (shown when menu is open) -->
  {#if $isMenuOpen}
    <div 
      class="fixed inset-0 bg-foreground/20 backdrop-blur-sm md:hidden" 
      style="z-index: var(--z-overlay)"
      on:click={() => ($isMenuOpen = false)} 
      aria-hidden="true"
    ></div>
  {/if}
</div> 