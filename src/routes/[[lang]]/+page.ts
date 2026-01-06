import { defaultLocale, locales } from "@/lib/i18n";
import type { EntryGenerator } from "./$types";

export const entries: EntryGenerator = () => locales.map(locale => ({ lang: locale === defaultLocale ? '': locale}));
