interface GameElement {
	id: number,
}

interface Card extends GameElement, HoverEvents, KeyboardEvents, MouseEvents, Transform, Draggable {
	width: number
};

interface Deck extends GameElement, HoverEvents, KeyboardEvents, MouseEvents, Transform, Draggable {
	width: number
}

interface Math {
	clamp: (value: number, min: number, max: number) => number,
}