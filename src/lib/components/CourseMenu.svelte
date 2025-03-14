<script lang="ts">
  import { page } from '$app/stores';
  import { BookOpen, Book, Calendar, ChevronDown, ChevronUp, FileText, Clipboard } from 'lucide-svelte';
  import type { MenuSection } from '$lib/utils/menu';
  
  // Define the MenuData interface if it doesn't exist in the menu utils
  interface MenuData {
    title: string;
    sections: MenuSection[];
    readings?: ReadingItem[];
    assignments?: AssignmentItem[];
  }
  
  // Define interfaces for readings and assignments
  interface ReadingItem {
    title: string;
    author?: string;
    pages?: string;
    url?: string;
  }
  
  interface AssignmentItem {
    title: string;
    due?: string;
    description?: string;
    path?: string;
  }
  
  export let courseId: string;
  export let menuData: MenuData | null = null;
  export let selectedCourse: string | null = null;
  // Current path for highlighting active item
  $: currentPath = $page.url.pathname;
  
  // Track expanded sections
  let expandedSections: Record<string, boolean> = {};
  

  // Initialize expanded state based on current path
  $: {
    if (menuData) {
      menuData.sections.forEach((section: MenuSection) => {
        // Auto-expand the section that contains the active item
        const hasActiveItem = section.items.some((item: { path: string }) => item.path === currentPath);
        if (hasActiveItem && !expandedSections[section.title]) {
          expandedSections[section.title] = true;
        }
      });
    }
  }
  
  function toggleSection(sectionTitle: string) {
    expandedSections[sectionTitle] = !expandedSections[sectionTitle];
  }
</script>

<div class="course-menu sticky top-8 overflow-y-auto overflow-x-hidden pr-4 max-h-[calc(100vh-8rem)]">
  <header class="mb-6">
   
  
    <a href="/{courseId}" class="inline-block">
      <h3 class="text-2xl font-semibold !font-archivo text-gray-800 hover:text-blue-600 transition-colors">
        {menuData?.title}
      </h3>
    </a>
    <p class="text-sm text-gray-600 mt-1 font-archivo">
      {courseId.toUpperCase() || 'Course Content'}
    </p>
    {#if selectedCourse}
    <div class="flex w-fit gap-1 my-4 ">
      <a 
        href="/{selectedCourse}/readings" 
        class="flex gap-1 items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded font-archivo text-xsß transition-colors"
      >
        <BookOpen class="size-3" />
        <span class="text-sm">Readings</span>
      </a>
      <a 
        href="/{selectedCourse}/assignments" 
        class="flex gap-1 items-center justify-center bg-green-50 hover:bg-green-100 text-green-700 py-2 px-3 rounded font-archivo text-xsß transition-colors"
      >
        <Clipboard class="size-3" />
        <span class="text-sm">Assignments</span>
      </a>
    </div>
  {/if}
  </header>
  
  {#if menuData}
    <nav aria-label="Course navigation">
      <ul class="space-y-6">
        <!-- Course Content Sections -->
        {#each menuData.sections as section}
          <li>
            <div class="course-section">
              <button 
                class="w-full flex items-center justify-between text-left mb-3 group"
                on:click={() => toggleSection(section.title)}
                aria-expanded={expandedSections[section.title] || false}
              >
                <h4 class="font-archivo font-semibold text-gray-700 group-hover:text-blue-600 flex items-center">
                  
                
                  {section.title}
                </h4>
                {#if expandedSections[section.title]}
                  <ChevronUp class="w-4 h-4 text-gray-500" />
                {:else}
                  <ChevronDown class="w-4 h-4 text-gray-500" />
                {/if}
              </button>
              
              {#if expandedSections[section.title]}
                <ul class="pl-6 space-y-2">
                  {#each section.items as item}
                    <li>
                      <a
                        href={item.path}
                        class="block py-1 text-sm font-archivo border-l-2 pl-3 -ml-px transition-colors {currentPath === item.path ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}"
                      >
                        {item.title}
                      </a>
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
          </li>
        {/each}
        
       
      </ul>
    </nav>
  {:else}
    <div class="p-4 bg-gray-50 rounded-lg">
      <p class="text-gray-500 font-archivo">No menu data available</p>
    </div>
  {/if}
</div>

<style>
  /* Smooth height transition for expanded sections */
  :global(.course-section ul) {
    transition: height 0.25s ease-in-out;
  }
</style> 