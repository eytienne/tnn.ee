import type { Handle } from '@sveltejs/kit';
import { normalizeLocale } from './lib/i18n';

export const handle: Handle = async ({ event, resolve,  }) => {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', normalizeLocale(event.params.lang)),
	});
};
