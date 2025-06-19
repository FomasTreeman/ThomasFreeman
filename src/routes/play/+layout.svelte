<script lang="ts">
	import '@fontsource-variable/jetbrains-mono';
	import Header from '$lib/Header.svelte';
</script>

<Header />
<slot />

<style>
	:global(body) {
		overflow-x: hidden;
		overflow-y: auto;
	}
	
	@media (max-width: 768px) {
		:global(body) {
			overflow: auto;
		}
	}
</style>