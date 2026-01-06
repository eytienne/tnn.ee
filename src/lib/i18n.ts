export const locales = ['fr', 'en'] as const;
export const defaultLocale: Locale = 'fr'; // keep in sync with redirects in ./netlify.toml

export type Locale = (typeof locales)[number];

export function normalizeLocale(maybe: string | undefined): Locale {
	return (locales as readonly string[]).includes(maybe ?? '')
		? (maybe as Locale)
		: defaultLocale;
}
