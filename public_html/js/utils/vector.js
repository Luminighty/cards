class Vector3 {
	constructor(data) {
		this.x = data.x || data[0] || 0;
		this.y = data.y || data[1] || 0;
		this.z = data.z || data[2] || 0;
	}

	get xy() {
		return {x: this.x, y: this.y};
	}

	/** @param {Vector3} other */
	add(other) {
		return this.apply(other, (a, b) => a + b);
	}

	/** @param {Vector3} other */
	sub(other) {
		return this.apply(other, (a, b) => a - b);
	}

	/** @param {number} other */
	mul(other) {
		return new Vector3([this.x * other, this.y * other, this.z * other]);
	}

	/** @param {number} other */
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

	/** 
	 * @template {(Matrix3 | Vector3)} T
	 * @param {T} other
	 * @returns {T}
	 */
	multiply(other) {
		return null;
	}
}
Object.defineProperty(Vector3, "zero", {
	get() {
		return new Vector3([0, 0, 0]);
	}
});

Object.defineProperty(Vector3, "one", {
	get() {
		return new Vector3([1, 1, 1]);
	}
});
Object.defineProperty(Vector3, "up", {
	get() {
		return new Vector3([0, 1, 0]);
	}
});
Object.defineProperty(Vector3, "down", {
	get() {
		return new Vector3([0, -1, 0]);
	}
});
Object.defineProperty(Vector3, "right", {
	get() {
		return new Vector3([1, 0, 0]);
	}
});
Object.defineProperty(Vector3, "left", {
	get() {
		return new Vector3([-1, 0, 0]);
	}
});
/** @param {number} z */ 
Vector3.z = (z) => new Vector3([0, 0, z]);