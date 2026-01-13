import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { marked, type TokenizerAndRendererExtension } from "marked";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export const randomItem = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const mds = import.meta.glob<true, string, string>("./content/**/**/*.md", { eager: true, query: "?raw", import: "default" });

const multiBreakExtension = {
	name: "multibreak",
	level: "block",

	start(src) {
		const index = src.match(/^\n{2,}/m)?.index;
		return index;
	},

	tokenizer(src) {
		const match = src.match(/^(\n{2,})/);
		if (!match) return;

		return {
			type: "multibreak",
			raw: match[1],
		};
	},

	renderer(token) {
		return "<br>".repeat(token.raw.length - 1);
	}
} as TokenizerAndRendererExtension;

marked.use({
	gfm: true,
	breaks: true, // IMPORTANT
	extensions: [multiBreakExtension]
});

export const md = (file: string) => marked.parse(mds[`./content/${file}`]);
