/**
 * @see https://tailwindcss.com/docs/padding
 */
export type Size = number | `${number}` | `(${string})` | `[${string}]`;

export const cs = (size: Size) => {
	if (typeof size === "number") {
		return `${size}px`;
	}
	{
		const number = Number.parseFloat(size);
		if (!Number.isNaN(number)) {
			return `calc(var(--spacing) * ${number})`;
		}
	}
	const matches = /^[([](.+)[)\]]$/m.exec(size);
	if (matches) {
		if (size.startsWith("(")) {
			return `var(${matches[1]})`;
		} else {
			return matches[1];
		}
	}
}
