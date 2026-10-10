import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'img-src': ['self', '*.sanisoclem-dev.pages.dev'],
				'script-src': ['self', 'static.cloudflareinsights.com'],
				'style-src': ['self', 'fonts.googleapis.com', 'unsafe-inline'],
				'font-src': ['self', 'fonts.gstatic.com'],
				'connect-src': ['self', 'cloudflareinsights.com']
			}
		}
	}
};

export default config;
