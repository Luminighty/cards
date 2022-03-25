const CSSStyles = {
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


const Position = {
	delta: (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y),
	length: (a) => Math.sqrt(a.x * a.x + a.y * a.y),
};

const Rect = {
	/** @param {DOMRect} rect */
	contains: (rect, position) => {
		return rect.left <= position.x && 
				rect.right >= position.x &&
				rect.top <= position.y && 
				rect.bottom >= position.y;
	}
};

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let RotationConstant = Math.PI / 16;

function GetRotate(counterClockwise = false, amount = 1) {
	return RotationConstant * (counterClockwise ? -1 : 1) * amount;
}

/**
 * 
 * @param {number} num 
 * @param {number} min 
 * @param {number} max 
 * @returns number
 */
Math.clamp = (num, min, max) => Math.min(Math.max(num, min), max);
