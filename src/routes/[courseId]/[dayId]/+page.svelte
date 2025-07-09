<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import MDLayout from '$lib/components/MDLayout.svelte';
  import TableOfContents from '$lib/components/TableOfContents.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import { Calendar, BookOpen, Clipboard, ArrowLeft, ArrowRight } from 'lucide-svelte';
  import { getContentFile } from '$lib/utils/contentService';
  import type { MenuSection, MenuItem, CourseMenu } from '$lib/utils/contentSchema';
  
  // Get course ID and day ID from URL params
  $: courseId = $page.params.courseId;
  $: dayId = $page.params.dayId;
  
  let content: any = null;
  let error: string | null = null;
  
  // Get menu data for navigation between days
  $: menuData = $page.data.menuData?.[courseId] as CourseMenu || { sections: [], title: '', readings: [], assignments: [] };
  $: currentDayPath = `/${courseId}/${dayId}`;
  
  // Find next and previous pages for navigation
  $: {
    let allItems: MenuItem[] = [];
    menuData.sections.forEach((section: MenuSection) => {
      allItems = [...allItems, ...section.items];
    });
    
    // Sort all items by their order property
    allItems.sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 999;
      const orderB = b.order !== undefined ? b.order : 999;
      return orderA - orderB;
    });
    
    const currentIndex = allItems.findIndex(item => item.path === currentDayPath);
    previousPage = currentIndex > 0 ? allItems[currentIndex - 1] : null;
    nextPage = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;
  }
  
  let previousPage: MenuItem | null = null;
  let nextPage: MenuItem | null = null;
  
  // Use a reactive statement instead of onMount to load content
  // This will re-run whenever courseId or dayId changes
  $: {
    // Reset content and error when parameters change
    content = null;
    error = null;
    
    try {
      // Use content service to get the content
      const module = getContentFile(courseId, dayId);
      if (module) {
        content = module.default;
      } else {
        error = `Could not load content for ${courseId}/${dayId}`;
        console.error(`No supported file found for ${courseId}/${dayId}`);
      }
    } catch (err) {
      error = `Could not load content for ${courseId}/${dayId}`;
      console.error(`Error loading content for ${courseId}/${dayId}:`, err);
    }
  }
</script>

{#if content?.metadata}
  <SEO 
    title={content.metadata.title || dayId}
    description={content.metadata.description || ''}
    courseId={courseId}
    contentType="day"
    date={content.metadata.date || ''}
  />
{:else}
  <SEO 
    title={dayId}
    courseId={courseId}
    contentType="day"
  />
{/if}

<!-- Two-column layout on desktop, single column on mobile -->
<div class="max-w-7xl mx-auto">
  {#if error}
    <div class="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-6 mb-6 shadow-sm">
      <p class="font-archivo text-lg mb-4">{error}</p>
      <p class="mt-2">
        <a href="/{courseId}" class="bg-destructive/10 text-destructive hover:bg-destructive/20 py-2 px-4 rounded inline-flex items-center font-archivo transition-colors">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Return to course page
        </a>
      </p>
    </div>
  {:else if content}
    <div class="flex flex-col md:flex-row">
      <!-- Main content area -->
      <div class="md:flex-1 md:max-w-3xl">
        <!-- Mobile Table of Contents at the top -->
         <div class="md:hidden">
          <TableOfContents />
         </div>
        
        <div class="bg-card rounded-lg shadow-sm p-6 mb-8">
          <!-- Content header with title, date & description -->
          <div >
            <!-- <h1 class="text-3xl font-libre-caslon mb-2">{content.metadata?.title || `${dayId.charAt(0).toUpperCase() + dayId.slice(1)}`}</h1> -->
            
            <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {#if content.metadata?.date}
                <div class="flex items-center">
                  <Calendar class="w-4 h-4 mr-1 text-primary" />
                  <span class="font-archivo">{content.metadata.date}</span>
                </div>
              {/if}
              {#if content.metadata?.section}
                <div class="flex items-center">
                  <BookOpen class="w-4 h-4 mr-1 text-primary" />
                  <span class="font-archivo">{content.metadata.section}</span>
                </div>
              {/if}
            </div>
            
            {#if content.metadata?.description}
              <p class="text-lg mt-4 font-archivo text-muted-foreground">{content.metadata.description}</p>
            {/if}
          </div>

          <!-- Main content area with improved MDLayout -->
          <MDLayout metadata={content.metadata}>
            <svelte:component this={content} />
          </MDLayout>
          
          <!-- Content navigation (previous/next) -->
          <div class="flex justify-between items-center border-t border-border pt-6 mt-8">
            {#if previousPage}
              <a href={previousPage.path} class="inline-flex items-center p-2 pr-4 text-primary hover:text-primary hover:bg-primary/10 rounded transition-colors">
                <ArrowLeft class="w-4 h-4 mr-2" />
                <span class="font-archivo text-sm">{previousPage.title}</span>
              </a>
            {:else}
              <div></div>
            {/if}
            
            <a href="/{courseId}" class="inline-flex items-center p-2 px-4 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
              <span class="font-archivo text-sm">Course Home</span>
            </a>
            
            {#if nextPage}
              <a href={nextPage.path} class="inline-flex items-center p-2 pl-4 text-primary hover:text-primary hover:bg-primary/10 rounded transition-colors">
                <span class="font-archivo text-sm">{nextPage.title}</span>
                <ArrowRight class="w-4 h-4 ml-2" />
              </a>
            {:else}
              <div></div>
            {/if}
          </div>
        </div>

        <!-- Supplemental materials sections -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Readings section -->
          {#if content.metadata?.readings && content.metadata.readings.length > 0}
            <div class="bg-primary/10 rounded-lg p-6 shadow-sm">
              <h2 class="text-xl font-libre-caslon mb-4 flex items-center">
                <BookOpen class="w-5 h-5 mr-2 text-primary" />
                <span>Readings</span>
              </h2>
              <ul class="space-y-3">
                {#each content.metadata.readings as reading}
                  <li class="font-archivo bg-card p-3 rounded shadow-sm border border-primary/20">
                    <div class="font-semibold text-primary">{reading.title}</div> 
                    {#if reading.author}
                      <div class="text-sm text-muted-foreground">by {reading.author}</div>
                    {/if}
                    {#if reading.pages}
                      <div class="text-sm text-muted-foreground mt-1">Pages: {reading.pages}</div>
                    {/if}
                  </li>
                {/each}
              </ul>
            </div>
          {/if}

          <!-- Assignments section -->
          {#if content.metadata?.assignments && content.metadata.assignments.length > 0}
            <div class="bg-secondary/10 rounded-lg p-6 shadow-sm">
              <h2 class="text-xl font-libre-caslon mb-4 flex items-center">
                <Clipboard class="w-5 h-5 mr-2 text-secondary" />
                <span>Assignments</span>
              </h2>
              <ul class="space-y-4">
                {#each content.metadata.assignments as assignment}
                  <li class="font-archivo bg-card p-3 rounded shadow-sm border border-secondary/20">
                    <div class="font-semibold text-secondary">{assignment.title}</div>
                    {#if assignment.due}
                      <div class="text-sm text-destructive mt-1 font-medium">Due: {assignment.due}</div>
                    {/if}
                    {#if assignment.description}
                      <div class="mt-2 text-muted-foreground">{assignment.description}</div>
                    {/if}
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Right sidebar with Table of Contents (desktop only) -->
      <div class="hidden md:block md:w-64 md:pl-8 md:sticky md:top-8 md:self-start md:max-h-screen md:overflow-y-auto">
        <TableOfContents />
      </div>
    </div>
  {:else}
    <div class="flex justify-center items-center h-64 bg-card rounded-lg shadow-sm">
      <div class="animate-pulse text-muted-foreground font-archivo flex flex-col items-center">
        <div class="w-8 h-8 border-4 border-t-primary border-primary/20 rounded-full animate-spin mb-4"></div>
        <div>Loading content...</div>
      </div>
    </div>
  {/if}
</div> 