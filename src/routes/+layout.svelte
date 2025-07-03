<script lang="ts">
	import '../app.css';
	import SEO from '$lib/components/SEO.svelte';
	// Data from server-side load function containing menu configuration
	export let data;
</script>

<!-- Default SEO for all pages (will be overridden by more specific SEO components) -->
<SEO
	title="Teaching Resources by Aman Bhargava"
	description="Slides, notes, and other resources for the courses I teach."
/>

<slot />
