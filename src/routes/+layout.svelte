<script lang="ts">
	import '../app.css';
	import SEO from '$lib/components/SEO.svelte';
	// Data from server-side load function containing menu configuration
	export let data;
</script>

<!-- Default SEO for all pages (will be overridden by more specific SEO components) -->
<SEO 
	title="Learning Resources by aman.bh"
	description="Slides, notes, and other resources for courses I teach."
/>

<!-- Pass data to child routes via the slot -->
<slot />
