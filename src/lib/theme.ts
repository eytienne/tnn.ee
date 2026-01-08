export const themes = ['light', 'dark'] as const;
export type Theme = (typeof themes)[number];

const KEY = 'theme';

export function applyTheme(theme: Theme) {
	document.documentElement.classList.toggle('dark', theme === 'dark');
	document.documentElement.style.colorScheme = theme;
}

export function loadTheme(): Theme {
	if (typeof window === "undefined") return 'light';
	const saved = localStorage.getItem(KEY);
	return (themes as readonly string[]).includes(saved ?? '') ? (saved as Theme) : 'light';
}

export function saveTheme(theme: Theme) {
	localStorage.setItem(KEY, theme);
}
