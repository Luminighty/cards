
interface MouseEvents {
	mousedown: (e: MouseEvent) => void,
	contextmenu: (e: MouseEvent) => void,
	mousemove: (e: MouseEvent) => void,
	mouseup: (e: MouseEvent) => void,
	wheel: (e: WheelEvent) => void,
}

interface HoverEvents {
	hovering: boolean,
	mouseenter: (e: MouseEvent) => void,
	mouseleave: (e: MouseEvent) => void,
}

interface KeyboardEvents {
	keyup: (e: KeyboardEvent) => void,
	keydown: (e: KeyboardEvent) => void,
}
