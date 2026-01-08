import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type PluginOption } from 'vite';
import { build, context, type BuildOptions } from 'esbuild';

export default defineConfig({
	server: { port: 4321 },
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		themeInit()
	],
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
