
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

		const transform = `scale(${s}) rotate(${r}rad) translate(${p.x}px, ${p.y}px)`
		ElementContainer.style.transform = transform;
		document.getElementById("background").style.transform = `translate(-50%, -50%) ${transform}`;
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
	apply(position) {
		const vec = new Vector3({z: 1, ...position});
		return Matrix3.multiply(
			Matrix3.rotate(-this.rotation),
			vec
		).xy;
	},

	applyAll(position) {
		const vec = new Vector3({z: 1, ...position});
		return Matrix3.multiply(
			Matrix3.translate(this.position.x, this.position.y),
			Matrix3.rotate(-this.rotation),
			vec
		).xy;
	},

	screenToGame(position) {
		const vec = new Vector3({z: 1, ...position});
		return Matrix3.multiply(
			Matrix3.translate(-this.position.x, -this.position.y),
			//Matrix3.rotate(-this.rotation),
			//Matrix3.scale(-this.scale, -this.scale),
			vec
		).xy;
	}
};

window.addEventListener("mousedown", (e) => {
	if (e.button == 2) {
		Camera.moved = false;
		Camera.grabbed = Mouse.fromEvent(e);
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
		const vec = new Vector3([e.movementX, e.movementY, 1]);
		const applied = Matrix3.multiply(
			Matrix3.rotate(-Camera.rotation),
			Matrix3.scale(1/Camera.scale, 1/Camera.scale),
			vec
		);
		const pos = Camera.position;
		pos.x += applied.x;
		pos.y += applied.y;
		Camera.position = pos;
	}
});