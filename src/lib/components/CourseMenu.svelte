<script lang="ts">
  import { page } from '$app/stores';
  import { Book, Calendar, ChevronDown, ChevronUp, FileText, Clipboard } from 'lucide-svelte';
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
  
  // Current path for highlighting active item
  $: currentPath = $page.url.pathname;
  
  // Track expanded sections
  let expandedSections: Record<string, boolean> = {};
  
  // New state for resource sections
  let showReadings = false;
  let showAssignments = false;
  
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

<div class="course-menu sticky top-8 overflow-y-auto pr-4 max-h-[calc(100vh-8rem)]">
  <header class="mb-6">
    <a href="/{courseId}" class="inline-block">
      <h3 class="text-2xl font-semibold font-libre-caslon text-gray-800 hover:text-blue-600 transition-colors">
        {courseId.toUpperCase()}
      </h3>
    </a>
    <p class="text-sm text-gray-600 mt-1 font-archivo">
      {menuData?.title || 'Course Content'}
    </p>
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
                  {#if section.title.toLowerCase().includes('assignment')}
                    <Calendar class="w-4 h-4 mr-2 text-green-600" />
                  {:else}
                    <Book class="w-4 h-4 mr-2 text-blue-600" />
                  {/if}
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
        
        <!-- Readings Section (if available) -->
        {#if menuData.readings && menuData.readings.length > 0}
          <li>
            <div class="course-section">
              <button 
                class="w-full flex items-center justify-between text-left mb-3 group"
                on:click={() => showReadings = !showReadings}
                aria-expanded={showReadings}
              >
                <h4 class="font-archivo font-semibold text-gray-700 group-hover:text-blue-600 flex items-center">
                  <FileText class="w-4 h-4 mr-2 text-purple-600" />
                  Course Readings
                </h4>
                {#if showReadings}
                  <ChevronUp class="w-4 h-4 text-gray-500" />
                {:else}
                  <ChevronDown class="w-4 h-4 text-gray-500" />
                {/if}
              </button>
              
              {#if showReadings}
                <ul class="pl-6 space-y-3">
                  {#each menuData.readings as reading}
                    <li>
                      <div class="border-l-2 border-purple-300 pl-3 -ml-px py-1">
                        <p class="text-sm font-medium text-gray-800">{reading.title}</p>
                        {#if reading.author}
                          <p class="text-xs text-gray-600">by {reading.author}</p>
                        {/if}
                        {#if reading.pages}
                          <p class="text-xs text-gray-500">Pages: {reading.pages}</p>
                        {/if}
                        {#if reading.url}
                          <a href={reading.url} class="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener">
                            Access online →
                          </a>
                        {/if}
                      </div>
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
          </li>
        {/if}
        
        <!-- Assignments Section (if available) -->
        {#if menuData.assignments && menuData.assignments.length > 0}
          <li>
            <div class="course-section">
              <button 
                class="w-full flex items-center justify-between text-left mb-3 group"
                on:click={() => showAssignments = !showAssignments}
                aria-expanded={showAssignments}
              >
                <h4 class="font-archivo font-semibold text-gray-700 group-hover:text-blue-600 flex items-center">
                  <Clipboard class="w-4 h-4 mr-2 text-green-600" />
                  Assignments
                </h4>
                {#if showAssignments}
                  <ChevronUp class="w-4 h-4 text-gray-500" />
                {:else}
                  <ChevronDown class="w-4 h-4 text-gray-500" />
                {/if}
              </button>
              
              {#if showAssignments}
                <ul class="pl-6 space-y-3">
                  {#each menuData.assignments as assignment}
                    <li>
                      <div class="border-l-2 border-green-300 pl-3 -ml-px py-1">
                        {#if assignment.path}
                          <a href={assignment.path} class="text-sm font-medium text-gray-800 hover:text-blue-600">
                            {assignment.title}
                          </a>
                        {:else}
                          <p class="text-sm font-medium text-gray-800">{assignment.title}</p>
                        {/if}
                        {#if assignment.due}
                          <p class="text-xs text-red-600 font-medium">Due: {assignment.due}</p>
                        {/if}
                        {#if assignment.description}
                          <p class="text-xs text-gray-600 mt-1">{assignment.description}</p>
                        {/if}
                      </div>
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
          </li>
        {/if}
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