<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import {  ArrowLeft } from 'lucide-svelte';
  // Define types for the menu structure
  type MenuItem = {
    title: string;
    path: string;
  };
  
  type MenuSection = {
    title: string;
    items: MenuItem[];
  };
  
  type CourseMenu = {
    title: string;
    sections: MenuSection[];
  };
  
  type MenuDataType = Record<string, CourseMenu>;
  
  export let menuData: MenuDataType = {};
  export let availableCourses: string[] = ['cdv2025', 'cs201'];
  
  // Get current course from URL or default to first available
  const courseIdFromUrl = $page.params.courseId || '';
  const selectedCourse = writable<string>(
    availableCourses.includes(courseIdFromUrl) 
      ? courseIdFromUrl 
      : availableCourses[0]
  );
  
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
</script>

<div class="flex min-h-screen flex-col md:flex-row">
  <!-- Mobile header with menu toggle -->
  <div class="sticky top-0 z-10 flex items-center justify-between bg-white p-4 md:hidden">
    <button 
      on:click={toggleMenu} 
      class="rounded border border-gray-300 p-2 text-gray-500"
      aria-label="Toggle menu"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={$isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
      </svg>
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
    class={`fixed  inset-y-0 left-0 z-20 w-64 transform bg-white p-4 shadow-lg transition-transform duration-300 ${$isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 md:shadow-none md:border-r border-gray-200`}
  >
  
    <div class="hidden md:block mb-8">
      <button on:click={() => goto('/')} class="bg-base-200 w-full flex group items-center text-base-300 justify-center text-white py-2 px-4 rounded font-medium text-center transition-colors hover:bg-purple">
        <ArrowLeft class="w-4 h-4 stroke-base-300 group-hover:stroke-white" />  <span class="group-hover:text-white ml-2 font-archivo text-base-300">Back</span>
      </button>
    </div>
    
    <!-- Course navigation menu -->
    {#if menuData[$selectedCourse]}
      <nav class="space-y-4">
        <a href={`/${$selectedCourse}`}>
          <h2 class="text-lg font-semibold mb-6 !font-archivo">{menuData[$selectedCourse].title}</h2>
        </a>
        
        {#each menuData[$selectedCourse].sections as section}
          <div class="mb-4">
            <h3 class="mb-2 !font-archivo text-sm font-semibold text-gray-500">{section.title}</h3>
            <ul class="space-y-1 pl-2">
              {#each section.items as item}
                <li>
                  <a 
                    href={item.path} 
                   
                    class={`block rounded py-1 px-2 text-sm hover:bg-gray-100 ${$page.url.pathname === item.path ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                  >
                    {item.title}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </nav>
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