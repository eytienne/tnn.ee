import { applyTheme, loadTheme } from "$lib/theme";

try {
	applyTheme(loadTheme());
} catch { /* empty */ }
