<script lang="ts">
  import { page } from '$app/stores';
  import { BookOpen, Book, Calendar, ChevronDown, ChevronUp, FileText, Clipboard } from 'lucide-svelte';
  import type { CourseMenu, MenuSection, Reading, Assignment, MenuItem } from '$lib/utils/contentSchema';
  
  export let courseId: string;
  export let menuData: CourseMenu | null = null;
  export let selectedCourse: string | null = null;
  
  // Current path for highlighting active item
  $: currentPath = $page.url.pathname;
  
  // Track expanded sections
  let expandedSections: Record<string, boolean> = {};
  
  // Compute flat list of all menu items across all sections
  $: flatMenuItems = menuData?.sections
    ? menuData.sections.flatMap((section) => section.items.map(item => ({ 
        ...item, 
        sectionTitle: section.title 
      })))
      .sort((a, b) => {
        const orderA = a.order !== undefined ? a.order : 999;
        const orderB = b.order !== undefined ? b.order : 999;
        return orderA - orderB;
      })
    : [];
  
  // Initialize expanded state based on current path
  $: {
    if (menuData && menuData.collapsibleSections !== false) {
      menuData.sections.forEach((section: MenuSection) => {
        // Auto-expand the section that contains the active item
        const hasActiveItem = section.items.some(item => item.path === currentPath);
        if (hasActiveItem && !expandedSections[section.title]) {
          expandedSections[section.title] = true;
        }
      });
    }
  }
  
  function toggleSection(sectionTitle: string) {
    expandedSections[sectionTitle] = !expandedSections[sectionTitle];
  }

  // Check if a section is an appendix section
  function isAppendixSection(sectionTitle: string): boolean {
    console.log(sectionTitle);
    return sectionTitle === 'Appendix' || 
           sectionTitle.toLowerCase().includes('appendix') || 
           sectionTitle.toLowerCase().includes('notice');
  }
  
  // Check if an item belongs to an appendix section
  function isAppendixItem(item: any): boolean {
    return item.sectionTitle && isAppendixSection(item.sectionTitle);
  }

  $: console.log(menuData);
</script>

<div class="course-menu sticky top-8 overflow-y-auto overflow-x-hidden pr-4 max-h-[calc(100vh-8rem)]">
  <header class="mb-6 border-b border-base-300 pb-4">
    <a href="/{courseId}" class="inline-block mb-2">
      <h3 class="text-2xl font-semibold !font-libre-caslon text-neutral hover:text-blue transition-colors">
        {menuData?.title}
      </h3>
    </a>
    <p class="text-sm text-base-300 font-archivo mb-4">
      {courseId.toUpperCase() || 'Course Content'}
    </p>
    {#if selectedCourse}
    <div class="flex  gap-2 my-4">
      <a 
        href="/{selectedCourse}/readings" 
        class="flex gap-1 items-center justify-center bg-base-200 hover:bg-blue text-neutral hover:text-white py-2 px-3 rounded-md border-2 border-neutral btn-drop-shadow font-roboto font-bold text-sm transition-colors"
      >
        <BookOpen class="size-3" />
        <span>Readings</span>
      </a>
      <a 
        href="/{selectedCourse}/assignments" 
        class="flex gap-1 items-center justify-center bg-base-200 hover:bg-sage text-neutral hover:text-neutral py-2 px-3 rounded-md border-2 border-neutral btn-drop-shadow font-roboto font-bold text-sm transition-colors"
      >
        <Clipboard class="size-3" />
        <span>Assignments</span>
      </a>
    </div>
  {/if}
  </header>
  
  {#if menuData}
    <nav aria-label="Course navigation">
      {#if menuData.showSections === false}
        <!-- Flat Menu (No Sections) -->
        <ul class="pl-6 space-y-2">
          <!-- Regular items first -->
          {#each flatMenuItems.filter(item => !isAppendixItem(item)) as item}
            <li>
              <a
                href={item.path}
                class="block py-1 text-sm font-archivo border-l-2 pl-3 -ml-px transition-colors {currentPath === item.path ? 'border-blue text-blue font-bold' : 'border-transparent text-neutral hover:text-blue hover:border-base-300'}"
              >
                {item.title}
              </a>
            </li>
          {/each}
        </ul>
        
        <!-- Show divider if there are appendix items -->
        {#if flatMenuItems.some(item => isAppendixItem(item))}
          <div class="border-t border-base-300 my-4"></div>
          
          <ul class="pl-6 space-y-2">
            <!-- Appendix items -->
            {#each flatMenuItems.filter(item => isAppendixItem(item)) as item}
              <li>
                <a
                  href={item.path}
                  class="block py-1 text-sm font-archivo border-l-2 pl-3 -ml-px transition-colors {currentPath === item.path ? 'border-blue text-blue font-bold' : 'border-transparent text-neutral hover:text-blue hover:border-base-300'}"
                >
                  {item.title}
                </a>
              </li>
            {/each}
          </ul>
        {/if}
      {:else}
        <!-- Main content sections -->
        <ul class="space-y-4 w-full">
          {#each menuData.sections.filter(s => !isAppendixSection(s.title)) as section}
            <li>
              <div class="course-section">
                {#if menuData.collapsibleSections !== false}
                  <!-- Collapsible Section Header -->
                  <button 
                    class="w-full flex items-center justify-between text-left mb-3 group"
                    on:click={() => toggleSection(section.title)}
                    aria-expanded={expandedSections[section.title] || false}
                  >
                    <h4 class="font-libre-caslon font-bold text-neutral group-hover:text-blue flex items-center">
                      {section.title}
                    </h4>
                    {#if expandedSections[section.title]}
                      <ChevronUp class="w-4 h-4 text-neutral" />
                    {:else}
                      <ChevronDown class="w-4 h-4 text-neutral" />
                    {/if}
                  </button>
                  
                  {#if expandedSections[section.title]}
                    <ul class="pl-6 space-y-2">
                      {#each section.items as item}
                        <li>
                          <a
                            href={item.path}
                            class="block py-1 text-sm font-archivo border-l-2 pl-3 -ml-px transition-colors {currentPath === item.path ? 'border-blue text-blue font-bold' : 'border-transparent text-neutral hover:text-blue hover:border-base-300'}"
                          >
                            {item.title}
                          </a>
                        </li>
                      {/each}
                    </ul>
                  {/if}
                {:else}
                  <!-- Non-Collapsible Section Header -->
                  <h4 class="font-libre-caslon font-bold text-neutral mb-3">
                    {section.title}
                  </h4>
                  
                  <ul class="pl-6 space-y-2">
                    {#each section.items as item}
                      <li>
                        <a
                          href={item.path}
                          class="block py-1 text-sm font-archivo border-l-2 pl-3 -ml-px transition-colors {currentPath === item.path ? 'border-blue text-blue font-bold' : 'border-transparent text-neutral hover:text-blue hover:border-base-300'}"
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
        
        <!-- Appendix sections with divider -->
        {#if menuData.sections.some(s => isAppendixSection(s.title))}
          <div class="border-t border-base-300 my-4"></div>
          
          <ul class="space-y-4 w-full">
            {#each menuData.sections.filter(s => isAppendixSection(s.title)) as section}
              <li>
                <div class="course-section">
                  {#if menuData.collapsibleSections !== false}
                    <!-- Collapsible Section Header -->
                    <button 
                      class="w-full flex items-center justify-between text-left mb-3 group"
                      on:click={() => toggleSection(section.title)}
                      aria-expanded={expandedSections[section.title] || false}
                    >
                      <h4 class="font-libre-caslon font-bold text-neutral group-hover:text-blue flex items-center">
                        {section.title}
                      </h4>
                      {#if expandedSections[section.title]}
                        <ChevronUp class="w-4 h-4 text-neutral" />
                      {:else}
                        <ChevronDown class="w-4 h-4 text-neutral" />
                      {/if}
                    </button>
                    
                    {#if expandedSections[section.title]}
                      <ul class="pl-6 space-y-2">
                        {#each section.items as item}
                          <li>
                            <a
                              href={item.path}
                              class="block py-1 text-sm font-archivo border-l-2 pl-3 -ml-px transition-colors {currentPath === item.path ? 'border-blue text-blue font-bold' : 'border-transparent text-neutral hover:text-blue hover:border-base-300'}"
                            >
                              {item.title}
                            </a>
                          </li>
                        {/each}
                      </ul>
                    {/if}
                  {:else}
                    <!-- Non-Collapsible Section Header -->
                    <h4 class="font-libre-caslon font-bold text-neutral mb-3">
                      {section.title}
                    </h4>
                    
                    <ul class="pl-6 space-y-2">
                      {#each section.items as item}
                        <li>
                          <a
                            href={item.path}
                            class="block py-1 text-sm font-archivo border-l-2 pl-3 -ml-px transition-colors {currentPath === item.path ? 'border-blue text-blue font-bold' : 'border-transparent text-neutral hover:text-blue hover:border-base-300'}"
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
        {/if}
      {/if}
    </nav>
  {:else}
    <div class="p-4 bg-base-200 rounded-lg border-2 border-neutral btn-drop-shadow">
      <p class="text-neutral font-archivo">No menu data available</p>
    </div>
  {/if}
</div>

<style>
  /* Smooth height transition for expanded sections */
  :global(.course-section ul) {
    transition: height 0.25s ease-in-out;
  }
</style> 