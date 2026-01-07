
<script lang="ts">
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import { Switch } from '@/lib/components/ui/switch';
	import { Label } from '@/lib/components/ui/label';
	import { defaultLocale, locales, normalizeLocale, switchLocale } from '@/lib/i18n';

	let { children, params }: LayoutProps = $props();
	const nonDefaultLocale = locales.find(locale => locale !== defaultLocale)!;
	// svelte-ignore state_referenced_locally
	const currentLocale = normalizeLocale(params.lang);
	let checked = $state(currentLocale !== defaultLocale);

	$effect(() => {
		const targetLocale = checked ? nonDefaultLocale : defaultLocale;
		if (currentLocale !== targetLocale) {
			window.location.pathname = switchLocale(page.url.pathname, targetLocale);
		}
	})
</script>

<div class="flex justify-end items-center space-x-2 p-3">
	<Label onclick={() => { checked = false; }}>{defaultLocale.toUpperCase()}</Label>
	<Switch bind:checked />
	<Label onclick={() => { checked = true; }}>{nonDefaultLocale?.toUpperCase()}</Label>
</div>
{@render children()}
