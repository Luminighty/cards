Mixins.Position = (object) => {
	Object.defineProperty(object, "position", {
		get() {
			return {
				x: parseInt(object.style.left) || 0,
				y: parseInt(object.style.top) || 0,
			};
		},
		set(value) {
			object.style.left = `${value.x}px`;
			object.style.top = `${value.y}px`;
		},
	});
};

Mixins.Transform = (object) => {
	object._transform = {
		_position: { x: 0, y: 0, },
		_rotation: 0,
		_scale: { x: 1, y: 1, },
		get position() { return this._position; },
		set position(value) {
			this._position = value;
			this.update();
		},
		get rotation() { return this._rotation; },
		set rotation(value) {
			this._rotation = value;// % (Math.PI * 2);
			this.update();
		},
		get scale() { return this._scale; },
		set scale(value) {
			this._scale = value;
			this.update();
		},
		get data() {
			return {
				position: this._position,
				rotation: this._rotation,
				scale: this._scale,
			};
		},
		update() {
			const p = this.position;
			const r = this.rotation;
			const s = this.scale;
			object.style.transform = `
				translate(${p.x}px, ${p.y}px)
				rotate(${r}rad)
				scale(${s.x}, ${s.y})`;
		}
	};
	Object.defineProperty(object, "position", {
		get() {return object.transform.position;},
		set(value) {object.transform.position = value;},
	});
	Object.defineProperty(object, "scale", {
		get() {return object.transform.scale;},
		set(value) {object.transform.scale = value;},
	});
	Object.defineProperty(object, "rotation", {
		get() {return object.transform.rotation;},
		set(value) {object.transform.rotation = value;},
	});
	if (!object.transform)
	Object.defineProperty(object, "transform", {
		get() {return object._transform;},
		set(value) {
			if (value.position != null)
				object.transform._position = value.position;
			if (value.rotation != null)
				object.transform._rotation = value.rotation;
			if (value.scale != null)
				object.transform._scale = value.scale;
			object.transform.update();
		}
	});
};