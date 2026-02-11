<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import metaImage from '$lib/assets/meta-image.png';
	import { m } from '@/lib/paraglide/messages';

	let { children } = $props();
	const title = "tnn.ee - Etienne Arabeyre";
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="og:title" content={title} />
	<meta name="description" content={m.meta_description()} />
	<meta name="og:description" content={m.meta_description()} />
	<meta name="og:image" content={metaImage} />
	<link rel="icon" href={favicon} />
</svelte:head>
<div class="relative mx-auto max-w-6xl">
	{@render children()}
</div>
