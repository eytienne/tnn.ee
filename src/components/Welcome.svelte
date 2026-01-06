<script lang="ts">
	import { onMount } from 'svelte';
	import tnnee from '@@/tnnee-plain.svg?raw'

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
</script>

<header class="h-55/100 flex justify-center items-end">
	<div id="title" bind:this={title} class="flex flex-col justify-center items-center">
		{@html tnnee}
		{#if false}
		<span id="target" style:--svgh={svgh + "px"} class="flex justify-center">
			Étienne
		</span>
		{/if}
	</div>
</header>

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
