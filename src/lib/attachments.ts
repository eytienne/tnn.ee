import type { Attachment } from "svelte/attachments";

const clickableIdHandler = (ev: PointerEvent) => {
	const id = (ev.currentTarget as Parameters<typeof clickableId>[0])?.getAttribute("id");
	if (id) {
		window.location.hash = id;
	}
};

export const clickableId: Attachment = (_el) => {
	const el = _el as HTMLElement;
	const className = "clickable-id";
	el.classList.add(className);
	el.addEventListener("click", clickableIdHandler);
	return () => {
		el.removeEventListener("click", clickableIdHandler);
		el.classList.remove(className);
	};
}
