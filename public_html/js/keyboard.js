const Input = {

	/** @param {KeyboardEvent} e */
	Rotate: (e) => e.key == Input.keys.rotate || e.key == Input.keys.rotateBack,

	/** @param {KeyboardEvent} e */
	ReverseRotate: (e) => e.key == Input.keys.rotateBack,

	/** @param {KeyboardEvent} e */
	Flip: (e) => e.key == Input.keys.flip,

	/** @param {KeyboardEvent} e */
	Shuffle: (e) => e.key == Input.keys.shuffle,

	/** @param {KeyboardEvent} e */
	Roll: (e) => e.key == Input.keys.roll,

	keys: {
		rotate: "e",
		rotateBack: "q",
		flip: "f",
		shuffle: "s",
		roll: "r",
	},
};