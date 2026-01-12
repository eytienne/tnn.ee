import type { EntryGenerator } from "./$types";
import { baseLocale, locales } from "@/lib/paraglide/runtime";

export const entries: EntryGenerator = () => locales.map(locale => ({ lang: locale === baseLocale ? '': locale}));
