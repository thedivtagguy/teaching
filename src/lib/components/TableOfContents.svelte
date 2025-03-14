<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { ChevronDown, ChevronUp } from 'lucide-svelte';
  
  // Props
  export let container: string = '.md-content'; // Selector for the content container
  export let headingSelector: string = 'h2, h3, h4'; // Which headings to include
  export let depth: number = 3; // Maximum depth of headings to include (2 = h2, 3 = h3, etc.)
  export let scrollOffset: number = 100; // Offset for scrolling to headings
  
  // State
  let headings: { id: string; text: string; level: number; element: HTMLElement }[] = [];
  let activeId: string | null = null;
  let tocVisible = false;
  
  function toggleToc() {
    tocVisible = !tocVisible;
  }
  
  // Get clean text from heading (excluding any anchor link text)
  function getHeadingText(el: HTMLElement): string {
    // Clone the node to avoid modifying the original
    const clone = el.cloneNode(true) as HTMLElement;
    
    // Remove anchor links from the clone
    const anchors = clone.querySelectorAll('.anchor-link');
    anchors.forEach(anchor => anchor.remove());
    
    // Return the clean text
    return clone.textContent?.trim() || '';
  }
  
  // Extract headings from the content
  function extractHeadings() {
    const contentContainer = document.querySelector(container);
    if (!contentContainer) return [];
    
    // Get all headings directly - they should have IDs from rehype-slug
    const headingElements = Array.from(contentContainer.querySelectorAll(headingSelector));
    
    return headingElements
      .filter((el) => {
        // Only include headings up to the specified depth
        const level = parseInt(el.tagName.substring(1));
        return level >= 2 && level <= depth + 1;
      })
      .map((el) => {
        const element = el as HTMLElement;
        return {
          id: element.id,
          text: getHeadingText(element),
          level: parseInt(element.tagName.substring(1)),
          element: element
        };
      });
  }
  
  // Update active heading on scroll
  function updateActiveHeading() {
    if (headings.length === 0) return;
    
    const scrollY = window.scrollY;
    
    // Find the heading that's currently visible
    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i];
      const headingTop = heading.element.getBoundingClientRect().top + window.scrollY;
      
      if (scrollY >= headingTop - scrollOffset - 20) {
        if (activeId !== heading.id) {
          activeId = heading.id;
        }
        return;
      }
    }
    
    // If no heading is found, use the first one
    activeId = headings[0]?.id || null;
  }
  
  // Scroll to heading when TOC item is clicked
  function scrollToHeading(id: string) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const y = element.getBoundingClientRect().top + window.scrollY - scrollOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    
    // On mobile, close the TOC after clicking
    if (window.innerWidth < 768) {
      tocVisible = false;
    }
  }
  
  // Initialize on mount
  onMount(() => {
    // Extract headings after the content has fully rendered
    setTimeout(() => {
      headings = extractHeadings();
      updateActiveHeading();
    }, 100);
    
    // Update active heading on scroll
    window.addEventListener('scroll', updateActiveHeading);
    
    return () => {
      window.removeEventListener('scroll', updateActiveHeading);
    };
  });
  
  // Re-extract headings when content changes
  afterUpdate(() => {
    setTimeout(() => {
      headings = extractHeadings();
      updateActiveHeading();
    }, 100);
  });
</script>

<!-- Mobile TOC Toggle -->
<div class="block md:hidden mt-2 mb-6">
  <button 
    on:click={toggleToc} 
    class="w-full flex items-center justify-between p-3 bg-base-200 rounded-md text-neutral font-roboto font-bold text-sm uppercase border-2 border-neutral btn-drop-shadow"
    aria-expanded={tocVisible}
    aria-controls="mobile-toc"
  >
    <span>Table of Contents</span>
    {#if tocVisible}
      <ChevronUp class="w-4 h-4" />
    {:else}
      <ChevronDown class="w-4 h-4" />
    {/if}
  </button>
  
  {#if tocVisible}
    <div id="mobile-toc" class="bg-base-100 mt-2 p-4 rounded-md border-2 border-neutral btn-drop-shadow">
      <nav aria-label="Table of contents">
        <ul class="space-y-2">
          {#each headings as heading}
            <li style="margin-left: {(heading.level - 2) * 1}rem">
              <a 
                href="#{heading.id}" 
                class="block py-1 hover:text-blue text-sm font-archivo {activeId === heading.id ? 'text-blue font-bold' : 'text-neutral'}"
                on:click|preventDefault={() => scrollToHeading(heading.id)}
              >
                {heading.text}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
    </div>
  {/if}
</div>

<!-- Desktop TOC -->
<div class="hidden md:block">
  {#if headings.length > 0}
    <div class="sticky top-8">
      <h4 class="text-sm font-bold text-neutral mb-4 font-roboto uppercase tracking-wide">On this page</h4>
      <nav aria-label="Table of contents">
        <ul class="space-y-2 border-l-2 border-base-300">
          {#each headings as heading}
            <li style="margin-left: {(heading.level - 2) * 0.75}rem">
              <a 
                href="#{heading.id}" 
                class="block pl-3 py-1 hover:text-blue text-sm font-archivo border-l-2 -ml-px {activeId === heading.id ? 'border-blue text-blue font-bold' : 'border-transparent text-neutral'}"
                on:click|preventDefault={() => scrollToHeading(heading.id)}
              >
                {heading.text}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
    </div>
  {/if}
</div> 