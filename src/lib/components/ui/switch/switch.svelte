<script lang="ts">
	import { Switch as SwitchPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import { cs, type Size } from "..";

	let {
		ref = $bindable(null),
		class: className,
		checked = $bindable(false),
		size = 22,
		...restProps
	}: WithoutChildrenOrChild<SwitchPrimitive.RootProps & { size?: Size }> = $props();
</script>

<SwitchPrimitive.Root
	bind:ref
	bind:checked
	data-slot="switch"
	class={cn(
		"data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 peer inline-flex shrink-0 items-center rounded-full border-none transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	style={`--h: ${cs(size)}`}
	{...restProps}
>
	<SwitchPrimitive.Thumb
		data-slot="switch-thumb"
		class={cn(
			"bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block rounded-full ring-0 transition-transform"
		)}
	/>
</SwitchPrimitive.Root>

<style lang="scss">
	:global {
		[data-slot=switch] {
			/* derived geometry */
			--w: calc(var(--h) * 2);
			--p: calc(var(--h) / 10);
			--tx: 0;
			--thumb: calc(var(--h) - (var(--p) * 2));

			height: var(--h);
			width: var(--w);
			padding: var(--p);
			box-sizing: border-box;

			> [data-slot=switch-thumb] {
				height: var(--thumb);
				width: var(--thumb);
				transform: translateX(var(--tx));
			}


			&[data-state=checked] {
				--tx: calc(var(--w) - var(--thumb) - (var(--p) * 2));
			}
		}
	}
</style>
