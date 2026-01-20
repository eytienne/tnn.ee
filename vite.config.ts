import { paraglideVitePlugin } from '@inlang/paraglide-js';
import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type PluginOption } from 'vite';
import { build, context, type BuildOptions } from 'esbuild';
import Icons from 'unplugin-icons/vite'
import { compareColors, stringToColor } from '@iconify/utils/lib/colors';
import {
	cleanupSVG,
	parseColors,
	runSVGO,
	deOptimisePaths,
	importDirectorySync,
} from '@iconify/tools';

const SVG_ICONS = 'svg-icons';

export default defineConfig({
	server: { port: 4321, host: '0.0.0.0' },

	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		themeInit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ["url", "baseLocale"],
		}),
		Icons({
			compiler: 'svelte',
			customCollections: {
				[SVG_ICONS]: async () => {
					const iconSet = importDirectorySync(
						`./src/lib/assets/${SVG_ICONS}`,
						{
							prefix: SVG_ICONS,
						}
					);

					iconSet.forEachSync((name) => {
						const svg = iconSet.toSVG(name);
						if (!svg) {
							return;
						}

						cleanupSVG(svg);

						const blackColor = stringToColor('black')!;

						parseColors(svg, {
							defaultColor: 'currentColor',
							callback: (attr, colorStr, color) => {
								if (color && compareColors(color, blackColor)) {
									return 'currentColor';
								}

								switch (color?.type) {
									case 'none':
									case 'current':
										return color;
								}

								throw new Error(
									`Unexpected color "${colorStr}" in attribute ${attr}`
								);
							},
						});

						runSVGO(svg);

						// Update paths for compatibility with old software
						deOptimisePaths(svg);

						iconSet.fromSVG(name, svg);
					});

					return iconSet.export();
				},
			},
		}),
	]
});

function themeInit(): PluginOption {
	const opts: BuildOptions = {
		entryPoints: ['src/theme-init.entry.ts'],
		bundle: true,
		format: 'iife',
		platform: 'browser',
		outfile: 'static/theme-init.js',
		logLevel: 'warning'
	};

	return {
		name: 'theme-init',

		async buildStart() {
			await build(opts);
		},

		async configureServer() {
			const ctx = await context(opts);

			await ctx.watch();
		}
	};
}
