
<script lang="ts">
	import type { LayoutProps } from './$types';
	import { Switch } from '@/lib/components/ui/switch';
	import { Label } from '@/lib/components/ui/label';
	import { applyTheme, saveTheme, type Theme } from '@/lib/theme';
	import { cn, randomItem } from '@/lib/utils';
	import tnnMD from '$lib/assets/tnn.md?raw';
	import { baseLocale, getLocale, locales, setLocale } from '@/lib/paraglide/runtime';
	import { m } from '@/lib/paraglide/messages';
	import LinkedIn from '~icons/svg-icons/linkedin'
	import GitHub from '~icons/svg-icons/github'

	const tnnTitles = tnnMD.trim().split("\n").filter(line => !/<!--.*-->/.test(line));
	const tnnTitle = tnnTitles.find(title => title.startsWith(">"))?.substring(1) ?? randomItem(tnnTitles);

	let { children, params }: LayoutProps = $props();
	const nonBaseLocale = locales.find(locale => locale !== baseLocale)!;
	// svelte-ignore state_referenced_locally
	const currentLocale = getLocale();
	let checked = $state(currentLocale !== baseLocale);

	let darkMode = $state(typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false);
	let themeApplied = $state(false);

	$effect(() => {
		const targetLocale = checked ? nonBaseLocale : baseLocale;
		if (currentLocale !== targetLocale) {
			setLocale(targetLocale);
		}
	});

	$effect(() => {
		const theme: Theme = darkMode ? 'dark': 'light';
		saveTheme(theme);
		applyTheme(theme);
		themeApplied = true;
	});

	const switcherClasses = cn`whitespace-nowrap flex items-center flex-col sm:flex-row gap-1 *:cursor-pointer`;
</script>

<header class="px-1 2xs:px-3 pt-3 absolute z-1 top-0 w-full flex justify-end items-center gap-1 2xs:gap-2 sm:gap-4 mx-auto">
	<h1 class="mr-auto self-start p-2 border-2 border-dashed" title="😆">{@html tnnTitle.replaceAll(/([A-Z]+)/g, `<span class="font-bold">$1</span>`)}</h1>
	<div id="locale-switcher" class={switcherClasses}>
		<Label class="text-md hidden sm:block" onclick={() => { checked = false; }}>{baseLocale.toUpperCase()}</Label>
		<Switch bind:checked class={cn("dark:data-[state=unchecked]:bg-muted-foreground/60")} />
		<Label class="text-md" onclick={() => { checked = true; }}>{nonBaseLocale?.toUpperCase()}</Label>
	</div>
	<div id="theme-switcher" class={cn(switcherClasses, themeApplied ? '' : 'theme-not-applied')}>
		<Switch id="theme-switcher-switch" bind:checked={darkMode}/>
		<Label class="text-md" for="theme-switcher-switch">{m.header__dark_mode()}</Label>
	</div>
</header>
<main class="px-1 2xs:px-3">
	{@render children()}
</main>
<footer class="px-1 2xs:px-3 pt-24 pb-3 text-3xl hover:text-secondary-foreground w-full flex justify-center items-center gap-2">
	<p class="text-base">made with 💦 by eytienne</p>
	<a target="_blank" href="https://github.com/eytienne" title="GitHub profile">
		<GitHub></GitHub>
	</a>
	<a target="_blank" href="https://www.linkedin.com/in/eytienne/" title="LinkedIn profile">
		<LinkedIn></LinkedIn>
	</a>
</footer>

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
