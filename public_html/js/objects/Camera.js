
const ElementContainer = document.getElementById("element-container");

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
		DB.Mouse.rotate(-this.rotation);
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

		//console.log(p, r, s);

		const transform = `scale(${s}) rotate(${r}rad) translate(${p.x}px, ${p.y}px)`;
		ElementContainer.style.transform = transform;
		
		DB.Camera.transform(this);
	},
	get data() {
		return {
			position: this.position,
			rotation: this.rotation,
			scale: this.scale,
		};
	},
	_: {
		position: {x: 0, y: 0},
		rotation: 0,
		scale: 1,
	},
	bounds: {
		minX: -2000,
		minY: -2000,
		maxX: 2000,
		maxY: 2000,
	},
	scaleBounds: {
		min: 0.4,
		max: 4,
	},
	_rotationSpeed: 500,
	_grabbed: false,
	_rotating: null,
	_moved: false,
	apply(position) {
		const vec = new Vector3({z: 1, ...position});
		return Matrix3.multiply(
			Matrix3.rotate(-this.rotation),
			//Matrix3.scale(this.scale, this.scale),
			vec
		).xy;
	},

	applyAll(position) {
		const vec = new Vector3({z: 1, ...position});
		return Matrix3.multiply(
			Matrix3.scale(1/this.scale, 1/this.scale),
			Matrix3.translate(this.position.x, this.position.y),
			Matrix3.rotate(-this.rotation),
			vec
		).xy;
	},

	screenToGame(position) {
		const vec = new Vector3({z: 1, ...position});
		const screen = {x: window.innerWidth / 2, y: window.innerHeight / 2};
		return Matrix3.multiply(
			Matrix3.translate(-this.position.x, -this.position.y),
			Matrix3.translate(screen.x, screen.y),
			
			Matrix3.rotate(-this.rotation),
			Matrix3.scale(1/this.scale, 1/this.scale),
			
			Matrix3.translate(-screen.x, -screen.y),
			//Matrix3.rotate(-this.rotation),
			//Matrix3.scale(-this.scale, -this.scale),
			vec
		).xy;
	}
};

window.addEventListener("load", () => {

	window.addEventListener("mousedown", (e) => {
		if (DraggedElement)
			return;
		if (e.button == 2) {
			Camera._moved = false;
			Camera._grabbed = Mouse.fromEvent(e);
		}
		if (e.button == 1) {
			e.preventDefault();
			Camera._rotating = true;
		}
	});

	window.addEventListener("mouseup", (e) => {
		if (e.button == 1) {
			e.preventDefault();
			Camera._rotating = false;
		}
	});
	
	window.addEventListener("contextmenu", (e) => {
		if (Camera._moved)
			e.preventDefault();
		Camera._grabbed = false;
	});
	
	window.addEventListener("mousemove", (e) => {
		if (Camera._grabbed) {
			Camera._moved = true;
			const vec = new Vector3([e.movementX, e.movementY, 1]);
			const applied = Matrix3.multiply(
				Matrix3.rotate(-Camera.rotation),
				Matrix3.scale(1/Camera.scale, 1/Camera.scale),
				vec
			);
			const pos = Camera.position;
			pos.x = Math.clamp(pos.x + applied.x, Camera.bounds.minX, Camera.bounds.maxX);
			pos.y = Math.clamp(pos.y + applied.y, Camera.bounds.minY, Camera.bounds.maxY);
			Camera.position = pos;
		}
		if (Camera._rotating) {
			Camera.rotation -= e.movementX / Camera._rotationSpeed;
		}
	});
	window.addEventListener("wheel", (e) => {
		if (DraggedElement)
			return;
		const scale = Camera.scale - Math.sign(e.deltaY) / 10 * Camera.scale
		Camera.scale = Math.clamp(scale, Camera.scaleBounds.min, Camera.scaleBounds.max);
	});
});

//Camera.update();