class Vector3 {
	constructor(data) {
		this.x = data.x || data[0] || 0;
		this.y = data.y || data[1] || 0;
		this.z = data.z || data[2] || 0;
	}

	get xy() {
		return {x: this.x, y: this.y};
	}

	add(other) {
		return this.apply(other, (a, b) => a + b);
	}
	sub(other) {
		return this.apply(other, (a, b) => a - b);
	}

	mul(other) {
		return new Vector3([this.x * other, this.y * other, this.z * other]);
	}

	div(other) {
		return new Vector3([this.x / other, this.y / other, this.z / other]);
	}

	apply(other, func) {
		return (typeof(other) == "function") ? 
			new Vector3([other(this.x), other(this.y), other(this.y)]) :
			new Vector3([
			func(this.x, other.x),
			func(this.y, other.y),
			func(this.z, other.z)
		]);
	}
}
/** @type {Vector3} */
Vector3.zero = {};
Object.defineProperty(Vector3, "zero", {
	get() {
		return new Vector3([0, 0, 0]);
	}
});

/** @type {Vector3} */
Vector3.one = {};
Object.defineProperty(Vector3, "one", {
	get() {
		return new Vector3([1, 1, 1]);
	}
});
/** @type {Vector3} */
Vector3.up = {};
Object.defineProperty(Vector3, "up", {
	get() {
		return new Vector3([0, 1, 0]);
	}
});
/** @type {Vector3} */
Vector3.down = {};
Object.defineProperty(Vector3, "down", {
	get() {
		return new Vector3([0, -1, 0]);
	}
});
/** @type {Vector3} */
Vector3.right = {};
Object.defineProperty(Vector3, "right", {
	get() {
		return new Vector3([1, 0, 0]);
	}
});
/** @type {Vector3} */
Vector3.left = {};
Object.defineProperty(Vector3, "left", {
	get() {
		return new Vector3([-1, 0, 0]);
	}
});


Vector3.z = (z) => new Vector3([0, 0, z]);