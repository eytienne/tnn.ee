<script lang="ts">
	import { Popover as PopoverPrimitive } from "bits-ui";
	import PopoverPortal from "./popover-portal.svelte";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";
	import type { ClassValue } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 4,
		align = "center",
		children,
		arrow = false,
		arrowClasses,
		portalProps,
		...restProps
	}: PopoverPrimitive.ContentProps & {
		arrow?: boolean,
		arrowClasses?: ClassValue | undefined | null;
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof PopoverPortal>>;
	} = $props();
</script>

<PopoverPortal {...portalProps}>
	<PopoverPrimitive.Content
		bind:ref
		data-slot="popover-content"
		{sideOffset}
		{align}
		class={cn(
			"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--bits-popover-content-transform-origin) rounded-sm border p-4 shadow-md outline-hidden",
			className
		)}
		{...restProps}
		>
		{@render children?.()}
		{#if arrow}
		<PopoverPrimitive.Arrow>
			{#snippet child({ props })}
				<div
				style:--tw-shadow="4px 4px 6px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 2px 2px 4px -2px var(--tw-shadow-color, rgb(0 0 0 / 0.1))"
					class={cn(
						"bg-popover z-50 size-2.5 rotate-45 rounded-[2px] shadow-md",
						"data-[side=top]:translate-x-1/2 data-[side=top]:translate-y-[calc(-50%_+_2px)]",
						"data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:-translate-y-[calc(-50%_+_1px)]",
						"data-[side=right]:translate-x-[calc(50%_+_2px)] data-[side=right]:translate-y-1/2",
						"data-[side=left]:-translate-y-[calc(50%_-_3px)]",
						arrowClasses
					)}
					{...props}
				></div>
			{/snippet}
		</PopoverPrimitive.Arrow>
		{/if}
	</PopoverPrimitive.Content>
</PopoverPortal>
