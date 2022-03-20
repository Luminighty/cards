
const Camera = {
	set position(value) {
		this._.position = value;
		this.update();
	},
	get position() {
		return this._.position;
	},

	set rotation(value) {
		this._.rotation = value;
		this.update();
	},
	get rotation() {
		return this._.rotation;
	},

	set scale(value) {
		this._.scale = value;
		this.update();
	},
	get scale() {
		return this._.scale;
	},
	update() {
		const p = this.position;
		const r = this.rotation;
		const s = this.scale;
		//ElementContainer.style.transform = `translate(${p.x}px, ${p.y}px) `;
		//document.body.style.backgroundPosition = `${p.x}px ${p.y}px`;
	},
	_: {
		position: {x: 0, y: 0},
		rotation: 0,
		scale: 1,
	},
	grabbed: false,
	rotating: null,
	moved: false,
};

window.addEventListener("mousedown", (e) => {
	console.log(e.button);
	if (e.button == 2) {
		Camera.moved = false;
		Camera.grabbed = true;
	}
});

window.addEventListener("contextmenu", (e) => {
	if (Camera.moved)
		e.preventDefault();
	Camera.grabbed = false;
});

window.addEventListener("mousemove", (e) => {
	if (Camera.grabbed) {
		Camera.moved = true;
		const pos = Camera.position;
		pos.x += e.movementX / Camera.scale;
		pos.y += e.movementY / Camera.scale;
		Camera.position = pos;
	}
});