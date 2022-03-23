class Matrix3 {
	
	constructor(data) {
		this.c11 = data.c11 || data[0] || 0;
		this.c12 = data.c12 || data[1] || 0;
		this.c13 = data.c13 || data[2] || 0;
		
		this.c21 = data.c21 || data[3] || 0;
		this.c22 = data.c22 || data[4] || 0;
		this.c23 = data.c23 || data[5] || 0;
		
		this.c31 = data.c31 || data[6] || 0;
		this.c32 = data.c32 || data[7] || 0;
		this.c33 = data.c33 || data[8] || 0;
	}

	add(other) {
		return this.apply(other, (a, b) => a + b);
	}

	apply(other, func) {
		return new Matrix3(Matrix3.keys().map((key) => func(this[key], other[key])));
	}

	static keys() {
		return ["c11", "c12", "c13", "c21", "c22", "c23", "c31", "c32", "c33"];
	}

	/** 
	 * @template {(Matrix3 | Vector3)} T
	 * @param {T} other
	 * @returns {T}
	 */
	multiply(other) {
		return Matrix3.multiplyWith[other.constructor.name](this, other);
	}
}

Object.defineProperty(Matrix3, "identity", {
	get() {
		return new Matrix3([1, 0, 0,
							0, 1, 0,
							0, 0, 1]);
	}
});


Matrix3.col1 = (r1, r2, r3) => 
	new Matrix3([r1, 0, 0,
				r2, 0, 0,
				r3, 0, 0]);

				
Matrix3.col2 = (r1, r2, r3) => 
	new Matrix3([0, r1, 0,
				0, r2, 0,
				0, r3, 0]);

			
Matrix3.col3 = (r1, r2, r3) => 
	new Matrix3([0, 0, r1,
				0, 0, r2,
				0, 0, r3]);

			

Matrix3.row1 = (c1, c2, c3) => 
	new Matrix3([c1, c2, c3,
				0, 0, 0,
				0, 0, 0]);

				
Matrix3.row2 = (c1, c2, c3) => 
	new Matrix3([0, 0, 0,
				c1, c2, c3,
				0, 0, 0]);

			
Matrix3.row1 = (c1, c2, c3) => 
	new Matrix3([0, 0, 0,
				0, 0, 0,
				c1, c2, c3,]);

/**
 * @param {number} c11 
 * @param {number} c22 
 * @param {number} c33 
 * @returns 
 */
Matrix3.diag = (c11, c22, c33) => 
	new Matrix3([c11, 0, 0,
				0, c22, 0,
				0, 0, c33]);


/** 
 * @param {(Matrix3 | Vector3)[]} matrixes 
 * @returns {any}
 */
Matrix3.multiply = (...matrixes) =>
	matrixes.reduceRight((prev, curr) => curr.multiply(prev)).apply({}, (self) => Math.round(self * MatrixPrecision) / MatrixPrecision);

Matrix3.translate = (dx, dy) =>
	Matrix3.identity.add(Matrix3.col3(dx, dy, 0));

Matrix3.scale = (dx, dy) =>
		Matrix3.diag(dx, dy, 1);

Matrix3.rotate = (angle) => {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return new Matrix3([
		cos, -sin, 0,
		sin, cos, 0,
		0, 0, 1]);
};


Matrix3.multiplyWith = {};
/** 
 * @param {Matrix3} self
 * @param {Matrix3} other
 */
Matrix3.multiplyWith.Matrix3 = (self, other) => {
	const cell = (row, col) => 
		self[`c${row}1`] * other[`c1${col}`] +
		self[`c${row}2`] * other[`c2${col}`] +
		self[`c${row}3`] * other[`c3${col}`];
	return new Matrix3([
		cell(1, 1), cell(1, 2), cell(1, 3),
		cell(2, 1), cell(2, 2), cell(2, 3),
		cell(3, 1), cell(3, 2), cell(3, 3),
	]);
};

/** 
 * @param {Matrix3} self
 * @param {Vector3} other
 */
Matrix3.multiplyWith.Vector3 = (self, other) => 
	new Vector3([
		self.c11 * other.x + self.c12 * other.y + self.c13 * other.z,
		self.c21 * other.x + self.c22 * other.y + self.c23 * other.z,
		self.c31 * other.x + self.c32 * other.y + self.c33 * other.z,
	]);

const MatrixPrecision = 100000;