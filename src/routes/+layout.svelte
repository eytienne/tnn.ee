<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { m } from '@/lib/paraglide/messages';

	let { children } = $props();
</script>

<svelte:head>
	<title>tnn.ee - Etienne Arabeyre</title>
	<meta name="description" content={m.meta_description()} />
	<link rel="icon" href={favicon} />
</svelte:head>
<div class="relative mx-auto max-w-6xl">
	{@render children()}
</div>
