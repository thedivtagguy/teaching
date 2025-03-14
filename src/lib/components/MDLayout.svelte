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
    line-height: 1.75;
    font-size: 1.05rem;
  }
  
  :global(.md-content h1),
  :global(.md-content h2),
  :global(.md-content h3),
  :global(.md-content h4) {
    position: relative; /* Position context for absolute positioning of anchor */
    font-family: var(--font-libre-caslon);
    color: #2d3748;
  }
  
  :global(.md-content h1) {
    font-weight: 700;
    margin-bottom: 1.5rem;
    font-size: 2.25rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  :global(.md-content h2) {
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.75rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid #edf2f7;
  }
  
  :global(.md-content h3) {
    font-weight: 600;
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
    font-size: 1.5rem;
  }
  
  :global(.md-content h4) {
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-size: 1.25rem;
    color: #4a5568;
  }
  
  /* Anchor link styling */
  :global(.anchor-link) {
    display: inline-block;
    margin-left: 0.5rem;
    opacity: 0;
    vertical-align: middle;
    transition: opacity 0.2s;
    color: #4299e1 !important;
    text-decoration: none !important;
    border-bottom: none !important;
  }
  
  :global(.md-content h1:hover .anchor-link),
  :global(.md-content h2:hover .anchor-link),
  :global(.md-content h3:hover .anchor-link),
  :global(.md-content h4:hover .anchor-link) {
    opacity: 0.8;
  }
  
  :global(.anchor-link:hover) {
    opacity: 1 !important;
  }
  
  :global(.link-icon) {
    display: inline-block;
    vertical-align: middle;
  }

  /* Content styling */
  :global(.md-content p) {
    font-family: var(--font-archivo);
    margin-bottom: 1.25rem;
    color: #2d3748;
  }
  
  :global(.md-content strong) {
    font-weight: 600;
    color: #1a202c;
  }
  
  :global(.md-content em) {
    font-style: italic;
    color: #4a5568;
  }
  
  :global(.md-content ul, .md-content ol) {
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  :global(.md-content ul) {
    list-style-type: disc;
  }
  
  :global(.md-content ol) {
    list-style-type: decimal;
  }
  
  :global(.md-content li) {
    font-family: var(--font-archivo);
    margin-bottom: 0.5rem;
    padding-left: 0.25rem;
  }
  
  :global(.md-content li:last-child) {
    margin-bottom: 0;
  }
  
  :global(.md-content li > ul, .md-content li > ol) {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  :global(.md-content a) {
    color: #3182ce;
    text-decoration: none;
    border-bottom: 1px solid rgba(49, 130, 206, 0.3);
    transition: color 0.2s, border-bottom-color 0.2s;
  }
  
  :global(.md-content a:hover) {
    color: #2c5282;
    border-bottom-color: rgba(44, 82, 130, 0.6);
  }
  
  :global(.md-content blockquote) {
    border-left: 4px solid #4299e1;
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 1.5rem;
    font-style: italic;
    color: #4a5568;
    background-color: #ebf8ff;
    padding: 1rem 1.5rem;
    border-radius: 0.25rem;
  }
  
  :global(.md-content blockquote p:last-child) {
    margin-bottom: 0;
  }
  
  :global(.md-content code) {
    font-family: var(--font-fira-code);
    background-color: rgba(226, 232, 240, 0.5);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.875em;
    color: #2d3748;
    border: 1px solid rgba(203, 213, 224, 0.5);
  }
  
  :global(.md-content pre) {
    background-color: #f8fafc;
    padding: 1.25rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-bottom: 1.75rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  :global(.md-content pre code) {
    background-color: transparent;
    padding: 0;
    font-size: 0.9em;
    border: none;
    color: #2d3748;
    line-height: 1.6;
  }
  
  /* Special definition styles for educational content */
  :global(.md-content dl) {
    margin-bottom: 1.5rem;
  }
  
  :global(.md-content dt) {
    font-weight: 600;
    font-family: var(--font-archivo);
    color: #2d3748;
    margin-bottom: 0.5rem;
  }
  
  :global(.md-content dd) {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
    font-family: var(--font-archivo);
  }
  
  /* Highlight important information */
  :global(.md-content .important),
  :global(.md-content .note),
  :global(.md-content .warning) {
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 0.5rem;
  }
  
  :global(.md-content .important) {
    background-color: #ebf8ff;
    border-left: 4px solid #4299e1;
  }
  
  :global(.md-content .note) {
    background-color: #f0fff4;
    border-left: 4px solid #48bb78;
  }
  
  :global(.md-content .warning) {
    background-color: #fffaf0;
    border-left: 4px solid #ed8936;
  }
  
  /* Tables */
  :global(.md-content table) {
    width: 100%;
    margin-bottom: 1.5rem;
    border-collapse: collapse;
    border: 1px solid #e2e8f0;
  }
  
  :global(.md-content th) {
    background-color: #f7fafc;
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #e2e8f0;
    color: #1a202c;
  }
  
  :global(.md-content td) {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  :global(.md-content tr:nth-child(even)) {
    background-color: #f7fafc;
  }
  
  :global(.md-content tr:hover) {
    background-color: #edf2f7;
  }
  
  /* Images */
  :global(.md-content img) {
    max-width: 100%;
    height: auto;
    margin: 1.5rem auto;
    border-radius: 0.5rem;
    display: block;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  /* Horizontal rule */
  :global(.md-content hr) {
    margin: 2rem 0;
    border: 0;
    height: 1px;
    background-color: #e2e8f0;
  }
  
  /* Special elements for educational content */
  :global(.md-content details) {
    margin-bottom: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
    padding: 0.5rem 1rem;
  }
  
  :global(.md-content summary) {
    font-weight: 600;
    cursor: pointer;
    padding: 0.5rem 0;
    color: #3182ce;
  }
  
  :global(.md-content details[open] summary) {
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
</style> 