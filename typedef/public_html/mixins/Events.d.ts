
interface MouseEvents {
	mousedown: (MouseEvent) => void,
	contextmenu: (MouseEvent) => void,
	mousemove: (MouseEvent) => void,
	mouseup: (MouseEvent) => void,
}

interface HoverEvents {
	hovering: boolean,
	mouseenter: (MouseEvent) => void,
	mouseleave: (MouseEvent) => void,
}

interface KeyboardEvents {
	keyup: (KeyboardEvent) => void,
	keydown: (KeyboardEvent) => void,
}
