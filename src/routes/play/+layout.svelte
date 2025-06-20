<script lang="ts">
	import '@fontsource-variable/jetbrains-mono';
</script>

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