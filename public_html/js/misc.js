const CSS = {
	UserDrag: (value) => {
		return `
		-webkit-user-drag: ${value};
		-khtml-user-drag: ${value};
		-moz-user-drag: ${value};
		-o-user-drag: ${value};
		user-drag: ${value};
		`;
	},

	UserSelect: (value) => {
		return `
		-webkit-user-select: ${value};
		-khtml-user-select: ${value};
		-moz-user-select: ${value};
		-o-user-select: ${value};
		user-select: ${value};
		`;
	}
};


const Mouse = {
	x: 0, y: 0,
	/** @param {MouseEvent} e */
	fromEvent: (e) => ({x: e.clientX, y: e.clientY}),
};


const Position = {
	delta: (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y),
};

const Rect = {
	/** @param {DOMRect} rect */
	contains: (rect, position) => {
		return rect.left <= position.x && 
				rect.right >= position.x &&
				rect.top <= position.y && 
				rect.bottom >= position.y;
	}
}

window.addEventListener("mousemove", (e) => {
	Mouse.x = e.clientX;
	Mouse.y = e.clientY;
});