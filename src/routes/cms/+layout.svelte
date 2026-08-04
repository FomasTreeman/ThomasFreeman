<script lang="ts">
	// Loads the shared CMS surface tokens for every /cms route
	import '$lib/styles/cms.css';

	let { children } = $props();
</script>

{@render children()}
