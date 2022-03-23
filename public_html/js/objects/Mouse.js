
const Mouse = {
	x: 0, y: 0,
	screenX: 0,
	screenY: 0,

	get position() {
		return {x: this.x, y: this.y};
	},

	get screen() {
		return {x: this.screenX, y: this.screenY};
	},

	/** @param {MouseEvent} e */
	fromEvent: (e) => (Camera.apply({x: e.clientX, y: e.clientY})),
};

window.addEventListener("load", () => {
	window.addEventListener("mousemove", (e) => {
		const {x, y} = Mouse.fromEvent(e);
		Mouse.x = x;
		Mouse.y = y;
		Mouse.screenX = e.clientX;
		Mouse.screenY = e.clientY;
	});
	
	window.addEventListener("mousemove", (e) => {
		DB.Mouse.move(Camera.screenToGame(Mouse.screen));
		//EmitPool.add("mouse move", Camera.screenToGame(Mouse.screen));
	});
});