
<script lang="ts">
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import { Switch } from '@/lib/components/ui/switch';
	import { Label } from '@/lib/components/ui/label';
	import { defaultLocale, locales, normalizeLocale, switchLocale } from '@/lib/i18n';
	import { applyTheme, saveTheme, type Theme } from '@/lib/theme';
	import { cn } from '@/lib/utils';

	let { children, params }: LayoutProps = $props();
	const nonDefaultLocale = locales.find(locale => locale !== defaultLocale)!;
	// svelte-ignore state_referenced_locally
	const currentLocale = normalizeLocale(params.lang);
	let checked = $state(currentLocale !== defaultLocale);

	let darkMode = $state(typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false);
	let themeApplied = $state(false);

	$effect(() => {
		const targetLocale = checked ? nonDefaultLocale : defaultLocale;
		if (currentLocale !== targetLocale) {
			window.location.pathname = switchLocale(page.url.pathname, targetLocale);
		}
	});

	$effect(() => {
		const theme: Theme = darkMode ? 'dark': 'light';
		saveTheme(theme);
		applyTheme(theme);
		themeApplied = true;
	});

	const switcherClasses = cn("switcher", "flex", "items-center", "space-x-1");
</script>

<header class="flex justify-end items-center space-x-4 p-3">
	<div id="locale-switcher" class={switcherClasses}>
		<Label class="text-md" onclick={() => { checked = false; }}>{defaultLocale.toUpperCase()}</Label>
		<Switch bind:checked class={cn("dark:data-[state=unchecked]:bg-muted-foreground/60")} />
		<Label class="text-md" onclick={() => { checked = true; }}>{nonDefaultLocale?.toUpperCase()}</Label>
	</div>
	<div id="theme-switcher" class={cn(switcherClasses, themeApplied ? '' : 'theme-not-applied')}>
		<Switch id="theme-switcher-switch" bind:checked={darkMode}/>
		<Label class="text-md" for="theme-switcher-switch">Dark mode</Label>
	</div>
</header>
{@render children()}

<style lang="scss">
	header {
		.theme-not-applied {
			opacity: 0;
			transform: translateY(-8px);

			:global([data-slot=switch-thumb]) {
				transition: none;
			}
		}
	}
</style>
