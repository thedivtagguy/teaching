<script lang="ts">
	import '../app.css';
	// Data from server-side load function containing menu configuration
	export let data;
</script>

<!-- Pass data to child routes via the slot -->
<slot />
