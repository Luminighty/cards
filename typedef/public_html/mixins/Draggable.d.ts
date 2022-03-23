
interface Draggable {
	dragOffset?: Vector2;
	drag: (e: MouseEvent, relativeTo?: Vector2) => void;
	setDrag: (offset: Vector2) => void;
	drop: (e: MouseEvent?) => void;
	grabbed: () => boolean;
}
