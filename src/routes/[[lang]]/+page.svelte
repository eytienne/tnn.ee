<script lang="ts">
	import { onMount } from 'svelte';
	import * as Popover from '@/lib/components/ui/popover';
	import tnnee from '@@/tnnee-plain.svg?raw'
	import { m } from '@/lib/paraglide/messages';
	import { md } from '@/lib/utils';
	import "./page.css";
	import ThinCross from '~icons/svg-icons/thin-cross'

	let title: HTMLDivElement;
	let svgh = $state(0);

	onMount(() => {
		window.addEventListener("resize", svgResize);
		svgResize();
	});

	function svgResize() {
		const svg = title.firstElementChild as SVGSVGElement;
		svgh = svg.clientHeight;
	}

	const titleHeight = "60vh";

	const kiss = "___KISS__";
	const aboutTitle = m.about_title({ kiss }).split(kiss, 2);

	const projectImgs = import.meta.glob<string>("../../lib/assets/projects/**/*.png", { query: "?url", import: "default", eager: true });
	const projects = [
		{
			key: "3distinct",
			img: projectImgs["../../lib/assets/projects/3distinct/desktop.png"],
			demo: "https://eytienne.github.io/3Distinct-public/"
		}
	];
</script>

<header style:--title-height={titleHeight} class="h-(--title-height) w-full flex justify-center items-end">
	<div id="title" bind:this={title} class="flex flex-col justify-center items-center">
		{@html tnnee}
		{#if false}
		<span id="target" style:--svgh={svgh + "px"} class="flex justify-center">
			Étienne
		</span>
		{/if}
	</div>
</header>
<div style:--title-height={titleHeight} class="px-3 sm:px-6 text-2xl w-full flex flex-col items-center *:w-full *:max-w-4xl">
	<section class="mt-[2em] text-center">
		{aboutTitle[0]}
		<Popover.Root>
			<Popover.Trigger openOnHover={true} openDelay={100} closeDelay={100} class="cursor-pointer underline">KISS</Popover.Trigger
			>
			<Popover.Content side="top" sideOffset={10} class="relative inline p-2 pr-5 bg-popover/96 font-medium">
				{m.about_kiss()}
				<Popover.Close class="absolute top-0 -right-0.25 size-5 [&_svg]:h-full [&_svg]:w-full"><ThinCross/></Popover.Close>
			</Popover.Content>
		</Popover.Root>
		{aboutTitle[1]}
	</section>
	<section id="skills" class="mt-[calc(100vh-var(--title-height)-2em)] flex flex-col">
		{@html md(m.about_skills())}
	</section>
	<section class="mt-32">
		<h2 class="text-3xl font-bold">{m.projects_title()}</h2>
		<div class="flex  mt-12 gap-4">
			{#each projects as project}
			<a target="_blank" href={project.demo} class="hover:[&_img]:duration-300 hover:[&_img]:transition-transform hover:[&_img]:scale-120 hover:[&_h3]:underline">
				<div class="overflow-hidden rounded-sm shadow-md">
					<img src="{project.img}" alt="{project.key} preview">
				</div>
				<div class="ps-2">
					<h3 class="font-semibold mt-2">{m[`${project.key}_title` as "3distinct_title"]()}</h3>
					<p>{m[`${project.key}_short_description` as "3distinct_short_description"]()}</p>
				</div>
			</a>
			{/each}
		</div>
	</section>
	<section class="mt-32">
		<h2 class="text-3xl font-bold">{m.contact_title()}</h2>
		<p class="mt-2 text-xl">{m.contact_subtitle()}</p>
		<div class="mt-4 grid 2xs:grid-cols-2 gap-y-4 gap-x-10 *:underline">
			<a
			class="2xs:text-right"
			target="_blank"
			rel="noreferrer"
			href="https://wa.me/33769936080?text=I'm%20interested%20in%20your%20car%20for%20sale"
			>
			{m.contact_cta_whatsapp()}
			</a>
			<a
			target="_blank"
			rel="noreferrer"
			href="mailto:arabeyre.etienne@gmail.com?subject={encodeURI(m.contact_email_subject())}">
			{m.contact_cta_email()}
			</a>
		</div>
	</section>
</div>

<style lang="scss">
	header {
		@font-face {
			font-family: ArchivoBlack;
			src: url('ArchivoBlack-Regular.ttf');
		}
		font-family: Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif;

		#title {
			font-family: ArchivoBlack;
			font-size: 165px;
			position: relative;
			max-width: 80%;

			:global {
				svg {
					width: 100%;
					height: fit-content;
					overflow: visible;
					display: flex;
					flex-direction: column;
					align-items: center;
					--duration: .3s;

					> * {
						fill: var(--color-foreground) !important;
						stroke: var(--color-foreground) !important;
						transition-property: all;
						transition-duration: var(--duration);
					}

					.letter-eaccute0 {
						transform: translateX(-276px);
						opacity: 0;
						--delay: 0.5;
						transition: opacity calc((1 - var(--delay))*var(--duration)) calc(var(--delay)*var(--duration));
					}
					.glyph-i {
						transition-property: stroke-dashoffset;
						stroke-dasharray: 1 !important;
						stroke-dashoffset: 1;
						transform: translateX(-177px);
					}

					&:hover {
						.letter-t0 {
							transform: translateX(21.5px);
						}
						.letter-n0, .letter-n1 {
							transform: translateX(88px);
						}
						.letter-e0 {
							transform: translateX(-67px);
						}
						.letter-e1 {
							transform: translateX(22px);
						}
						.letter-dot0 {
							transform: translate(-59.25px, -20px) scale(0.94, 0.68);
						}
						.letter-eaccute0 {
							opacity: 1;
						}
						.glyph-i {
							stroke-dashoffset: 0;
						}
					}
				}
			}

			#target {
				height: 100%;
				width: auto;
				pointer-events: none;
				font-size: calc(1.114*var(--svgh));
				margin-top: calc(-0.217*var(--svgh));
				margin-left: calc(-0.033*var(--svgh));
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
				color: green;
				opacity: 0.5;
			}
		}
	}
</style>
