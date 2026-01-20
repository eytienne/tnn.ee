<script lang="ts">
	import { onMount, tick } from 'svelte';
	import * as Popover from '@/lib/components/ui/popover';
	import tnnee from '@@/tnnee-plain.svg?raw'
	import { m } from '@/lib/paraglide/messages';
	import { md } from '@/lib/utils';
	import "./page.css";
	import type { FadeParams, TransitionConfig } from 'svelte/transition';
	import { cubicOut, quartOut } from 'svelte/easing';
	import { Slider } from "$lib/components/ui/slider/index.js";

	let title: HTMLDivElement;
	let svgh = $state(0);

	onMount(() => {
		window.addEventListener("resize", svgResize);
		window.addEventListener("scroll", (ev) => {
			kissOpen = false;
			if (chaosSettingOpen) {
				showChaosSetting();
			}
			chaosSettingOpen = false;
		});
		svgResize();
	});

	function svgResize() {
		const svg = title.firstElementChild as SVGSVGElement;
		svgh = svg.clientHeight;
	}

	const titleHeight = "60vh";

	const kiss = "___KISS__";
	const aboutTitle = m.about_title({ kiss }).split(kiss, 2);
	let kissOpen = $state(false);

	type Particle = {
		particleId: number;
		angle: number;
		rotate: number;
		distance: number;
		scale: number;
	};
	let particles = $state([] as Particle[]);
	let particleId = -1;

	const particleDuration = 1000;
	const particleCount = 12;

	let chaos = $state(50);
	let chaosSettingOpen = $state(false);
	let chaosSettingShow = $state(false);
	const chaosSettingShowDuration = 3000;
	let hideChaosSetting: NodeJS.Timeout|number;
	function showChaosSetting() {
		if (hideChaosSetting) {
			clearTimeout(hideChaosSetting);
		}
		chaosSettingShow = true;
		hideChaosSetting = setTimeout(function() {
			chaosSettingShow = false;
		}, chaosSettingShowDuration);
	}

	const _bias: Omit<Particle, 'particleId'> = {
		angle: 20/180*Math.PI,
		rotate: 50/180*Math.PI,
		distance: 10,
		scale: 0.5
	};

	function popParticles() {
		showChaosSetting();
		const newParticles = [] as Particle[];
		for (let ii = 0; ii < particleCount; ii++) {
			newParticles.push(biased({
				particleId: ++particleId,
				angle: ii * 2 * Math.PI / particleCount,
				rotate: 45/180*Math.PI,
				distance: 60 + ii%2 * 10,
				scale: 1,
			}));
		}
		particles.push(...newParticles);
		tick().then(() => {
			particles.splice(particles.findIndex(pp => pp.particleId === newParticles[0].particleId), particleCount);
		});
	}

	function biased(particle: Particle) {
		return {
			...particle,
			angle: bias(particle.angle, _bias.angle),
			rotate: bias(particle.rotate, _bias.rotate),
			distance: bias(particle.distance, _bias.distance),
			scale: bias(particle.scale, _bias.scale)
		} as Particle;
	}
	function bias(value: number, delta: number) {
		const _biased = value + (Math.random() * 2 - 1) * chaos/100 * delta;
		return Number.parseFloat(_biased.toPrecision(2)).valueOf();
	}

	type PopParams = Omit<FadeParams, 'easing'>& { particle: Particle; };
	function pop(_node: HTMLSpanElement, { duration, delay, particle }: PopParams): TransitionConfig {
		return {
			duration,
			delay,
			css(t, u) {
				const tt = quartOut(u);
				return `
					translate: calc(-50% + ${Math.cos(particle.angle)*particle.distance*tt}px) calc(25% + ${Math.sin(particle.angle)*particle.distance*tt}px);
					opacity: ${cubicOut(t)};
				`;
			},
		}
	};

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
	<section class="mt-[2em] text-center relative">
		<Popover.Root bind:open={kissOpen}>
			{aboutTitle[0]}<!--
				hack to avoid a whitespace
			--><Popover.Trigger onmouseenter={popParticles} onclick={popParticles} openOnHover={true} openDelay={100} closeDelay={100} class="cursor-pointer underline text-link relative">
				KISS
				{#each particles as particle(particle.particleId)}
				<span
					out:pop={{ duration: particleDuration, particle }}
					style={`rotate: ${particle.rotate}rad; scale: ${particle.scale};`}
					class="absolute -z-1 left-1/2 icon-[noto--kiss-mark] pointer-events-none"
					></span>
				{/each}
			</Popover.Trigger><!--
				hack to avoid a whitespace
			-->{aboutTitle[1]}
			<Popover.Content side="bottom" sideOffset={20} class="relative inline p-2 bg-popover/96 font-medium" arrow={true} arrowClasses="bg-popover/96">
				{m.about_kiss()}
			</Popover.Content>
		</Popover.Root>
		<Popover.Root bind:open={chaosSettingOpen}>
			<Popover.Trigger onmousemove={() => showChaosSetting() } onclick={(e) => { if (!chaosSettingShow) { e.preventDefault(); }}} class="absolute -bottom-6 ml-2 p-1 size-8 opacity-88 hover:outline-2 rounded-md {chaosSettingShow || chaosSettingOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-200">
				<span class="icon-[ic--outline-settings] text-muted-foreground"></span>
			</Popover.Trigger>
			<Popover.Content onEscapeKeydown={() => showChaosSetting() } side="right" sideOffset={30} class="w-fit bg-popover/96 font-medium flex gap-2 py-5">
				<Slider type="single" bind:value={chaos} min={0} max={100} step={1} orientation="vertical" class="data-[orientation=vertical]:w-4.5" thumbPositioning="exact"/>
				<div class="flex flex-col justify-between">
					<p>{m.about_kiss_chaos()}<br>{chaos} % {#if chaos === 100 }🔥{:else if chaos === 0}🥶{/if}</p>
					<p>{@html m.about_kiss_inspired({ link: `<br><a class="text-link underline" target="_blank" rel="noreferrer" href="https://whimsy.joshwcomeau.com/">Whimsical Animations</a>`})}</p>
				</div>
			</Popover.Content>
		</Popover.Root>
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
		<p class="mt-8 text-lg">{@html m.contact_cta_resume({ link: `<a href="/${m.resume()}" target="_blank" rel="noopener" class="underline">${m.resume()}</a>`})}</p>
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
