<script>
  import { onMount } from 'svelte';
  import { ExternalLink, Search, Filter, X } from 'lucide-svelte';
  import { fly, fade } from 'svelte/transition';
  import { Input } from '$lib/components/ui/input';

  export let courseId;

  let library = [];
  let filteredLibrary = [];
  let searchTerm = '';
  let selectedTags = new Set();
  let allTags = new Set();
  let showFilters = false;
  let viewMode = 'list'; // 'grid' or 'list'

  onMount(async () => {
    try {
      const response = await fetch(`/${courseId}/data/library.json`);
      const data = await response.json();
      // Handle BetterBibTeX JSON format which has items nested under "items" key
      library = data.items || data;
      filteredLibrary = library;

      // Extract all tags from the library
      library.forEach(item => {
        if (item.tags) {
          item.tags.forEach(tag => {
            if (typeof tag === 'string') {
              allTags.add(tag);
            } else if (tag.tag) {
              allTags.add(tag.tag);
            }
          });
        }
      });
      allTags = new Set([...allTags].sort());
    } catch (error) {
      console.warn('Could not load library.json:', error);
    }
  });

  $: {
    filteredLibrary = library.filter(item => {
      const matchesSearch = !searchTerm ||
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.creators && item.creators.some(creator =>
          `${creator.firstName || ''} ${creator.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
        )) ||
        (item.abstractNote && item.abstractNote.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.publicationTitle && item.publicationTitle.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTags = selectedTags.size === 0 ||
        (item.tags && item.tags.some(tag => {
          const tagName = typeof tag === 'string' ? tag : tag.tag;
          return selectedTags.has(tagName);
        }));

      return matchesSearch && matchesTags;
    });
  }

  function toggleTag(tag) {
    if (selectedTags.has(tag)) {
      selectedTags.delete(tag);
    } else {
      selectedTags.add(tag);
    }
    selectedTags = selectedTags;
  }

  function formatAuthors(creators) {
    if (!creators || creators.length === 0) return 'Unknown Author';
    return creators
      .map(creator => `${creator.firstName || ''} ${creator.lastName || ''}`.trim())
      .filter(name => name)
      .join(', ');
  }

  function formatDate(date) {
    if (!date) return '';
    return new Date(date).getFullYear();
  }

  function getItemTags(item) {
    if (!item.tags) return [];
    return item.tags.map(tag => typeof tag === 'string' ? tag : tag.tag).filter(Boolean);
  }

  function clearFilters() {
    searchTerm = '';
    selectedTags = new Set();
  }

  function getItemType(item) {
    if (item.itemType) return item.itemType;
    if (item.url && item.url.includes('youtube')) return 'video';
    if (item.url && item.url.includes('github')) return 'code';
    if (item.publicationTitle) return 'article';
    return 'document';
  }
</script>

<!-- Header -->
<div >
  <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <p class="text-muted-foreground font-archivo m-0 p-0 text-lg">
        Reading collection for {courseId.toUpperCase()}
      </p>
  </div>
</div>

<!-- Search and Filters -->
<div class="mb-6 space-y-4">
  <!-- Search Bar -->
  <div class="relative">
    <div class="flex items-center">
      <Search class="text-muted-foreground absolute left-3 z-10 h-5 w-5" />
      <Input
        type="text"
        placeholder="Search by title, author, publication, or abstract..."
        class="font-archivo pl-10"
        bind:value={searchTerm}
      />
    </div>
  </div>

</div>

<!-- Results -->
{#if filteredLibrary.length === 0 && library.length === 0}
  <div class="bg-muted border-foreground btn-drop-shadow rounded-lg border-2 p-8 text-center">
    <p class="text-foreground font-archivo font-bold mb-4">
      No library items found.
    </p>
    <p class="text-muted-foreground font-archivo text-sm">
      Export your Zotero collection as JSON and place it at
      <code class="bg-card text-foreground rounded px-2 py-1">static/{courseId}/data/library.json</code>
    </p>
  </div>
{:else if filteredLibrary.length === 0}
  <div class="bg-muted border-foreground btn-drop-shadow rounded-lg border-2 p-8 text-center">
    <p class="text-foreground font-archivo font-bold">
      No items match your current filters.
    </p>
    <button
      on:click={clearFilters}
      class="bg-primary hover:bg-primary/80 text-primary-foreground font-archivo mt-4 rounded-md px-4 py-2 text-sm font-bold transition-colors"
    >
      Clear Filters
    </button>
  </div>
{:else}
  <!-- Grid Layout -->
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each filteredLibrary as item, index}
      <div
        in:fly={{ y: 20, duration: 300, delay: index * 50 }}
        class="bg-card border-foreground  group relative overflow-hidden rounded-xs border-2 transition-all hover:-translate-y-1 hover:shadow-lg"
      >

        <div class="p-4">
          <!-- Title -->
          <div class="font-roboto text-foreground mb-2 text-lg font-bold leading-tight">
            {#if item.url}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:text-primary/80 flex items-start gap-1 transition-colors group-hover:underline"
              >
                <span class="flex-1">{item.title || 'Untitled'}</span>
                <ExternalLink class="mt-1 h-4 w-4 flex-shrink-0" />
              </a>
            {:else}
              {item.title || 'Untitled'}
            {/if}
          </div>

          <!-- Authors -->
          {#if item.creators && item.creators.length > 0}
            <p class="text-muted-foreground font-archivo mb-2 text-sm">
              {formatAuthors(item.creators)}
            </p>
          {/if}

          <!-- Publication & Date -->
          <div class="text-muted-foreground font-archivo mb-3 space-y-1 text-xs">
            {#if item.publicationTitle}
              <p class="italic">{item.publicationTitle}</p>
            {/if}
            {#if item.date}
              <p>{formatDate(item.date)}</p>
            {/if}
          </div>

          <!-- Abstract (truncated) -->
          {#if item.abstractNote}
            <p class="text-foreground font-archivo mb-3 text-sm leading-relaxed opacity-80">
              {item.abstractNote.length > 120
                ? item.abstractNote.substring(0, 120) + '...'
                : item.abstractNote}
            </p>
          {/if}

          <!-- Tags -->
          {#if getItemTags(item).length > 0}
            <div class="flex flex-wrap gap-1">
              {#each getItemTags(item).slice(0, 3) as tag}
                <button
                  on:click={() => {
                    if (!selectedTags.has(tag)) {
                      toggleTag(tag);
                    }
                  }}
                  class="bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground font-archivo rounded px-2 py-0.5 text-xs font-bold transition-colors"
                >
                  {tag}
                </button>
              {/each}
              {#if getItemTags(item).length > 3}
                <span class="text-muted-foreground font-archivo px-2 py-0.5 text-xs">
                  +{getItemTags(item).length - 3} more
                </span>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
{/if}