export const themes = ['light', 'dark'] as const;
export type Theme = (typeof themes)[number];

const KEY = 'theme';

export function applyTheme(theme: Theme) {
	document.documentElement.classList.toggle('dark', theme === 'dark');
	document.documentElement.style.colorScheme = theme;
}

export function loadTheme(): Theme {
	const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	console.log("defaultTheme", defaultTheme)
	if (typeof window === "undefined") return defaultTheme;
	const saved = localStorage.getItem(KEY);
	return (themes as readonly string[]).includes(saved ?? '') ? (saved as Theme) : defaultTheme;
}

export function saveTheme(theme: Theme) {
	localStorage.setItem(KEY, theme);
}
