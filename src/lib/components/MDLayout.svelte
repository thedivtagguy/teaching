<script lang="ts">
  // Import metadata from the markdown file
  export let metadata = {};
</script>

<div class="md-content prose prose-blue max-w-none">
  <slot />
</div>

<style>
  :global(.md-content) {
    /* Base styling for markdown content */
    line-height: 1.6;
  }
  
  :global(.md-content h1) {
    font-family: var(--font-libre-caslon);
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  :global(.md-content h2, .md-content h3, .md-content h4) {
    font-family: var(--font-libre-caslon);
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  :global(.md-content p, .md-content li) {
    font-family: var(--font-archivo);
    margin-bottom: 1rem;
  }
  
  :global(.md-content a) {
   
    text-decoration: none;
  }
  
  :global(.md-content a:hover) {
    text-decoration: underline;
  }
  
  :global(.md-content code) {
    font-family: var(--font-fira-code);
    background-color: rgba(0, 0, 0, 0.05);
    padding: 0.1em 0.3em;
    border-radius: 3px;
    font-size: 0.9em;
  }
  
  :global(.md-content pre) {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    margin-bottom: 1.5rem;
  }
  
  :global(.md-content pre code) {
    background-color: transparent;
    padding: 0;
    font-size: 0.9em;
  }
  
  :global(.anchor-link) {
    opacity: 0;
   
    transition: opacity 0.2s;
  }
  
  :global(.md-content h2:hover .anchor-link, 
           .md-content h3:hover .anchor-link, 
           .md-content h4:hover .anchor-link) {
    opacity: 0.8;
  }
</style> 