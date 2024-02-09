<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/jetbrains-mono';
	import Background from '$lib/Background.svelte';
	import Header from '../lib/Header.svelte';
	import Footer from '../lib/Footer.svelte';
	import { SpeedInsights } from "@vercel/speed-insights/next"
</script>

<SpeedInsights/>
<Background />
<Header />
<slot />
<Footer />
