<script>
  import { page } from '$app/stores';
  
  // Required props
  export let title = '';
  
  // Optional props with defaults
  export let description = '';
  export let type = 'website'; // website, article, etc.
  export let image = ''; // URL to the image
  export let courseId = '';
  export let contentType = 'page'; // page, assignment, day
  export let date = '';
  
  // Site domain for absolute URLs
  const domain = 'https://teaching.aman.bh';
  
  // Computed values
  $: fullTitle = (courseId ? `${title} | ${courseId.toUpperCase()}` : title).split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  $: ogImage = image || `${domain}/og-default.png`;
  $: currentUrl = $page.url.href.startsWith('http') ? $page.url.href : `${domain}${$page.url.pathname}`;
  $: siteName = 'Learning Resources by aman.bh';
</script>

<svelte:head>
  <title>{fullTitle}</title>
  {#if description}
    <meta name="description" content={description} />
  {/if}
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:url" content={currentUrl} />
  <meta property="og:title" content={fullTitle} />
  {#if description}
    <meta property="og:description" content={description} />
  {/if}
  <meta property="og:image" content={ogImage} />
  <meta property="og:site_name" content={siteName} />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content={currentUrl} />
  <meta name="twitter:title" content={fullTitle} />
  {#if description}
    <meta name="twitter:description" content={description} />
  {/if}
  <meta name="twitter:image" content={ogImage} />
  
  <!-- Additional metadata -->
  {#if courseId}
    <meta property="article:section" content={courseId} />
  {/if}
  {#if date}
    <meta property="article:published_time" content={new Date(date).toISOString()} />
  {/if}
  
  <link rel="canonical" href={currentUrl} />
</svelte:head>