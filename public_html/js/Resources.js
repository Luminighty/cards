
/**
 * @typedef {Object} CardDataType
 * @property {number} id
 * @property {string} front
 * @property {string} back
 * @property {boolean} flipped
 */

const Resource = {
	Card: (value) => value ? `res/${value}` : "",
	Object: (value) => value ? `res/${value}` : "",
	Dice: (value) => value ? `res/dice/${value}` : "",
};

const DB = {
	Card: {
		get: (id, callback) =>
			socket.emit("get card", id, callback),
		flip: (id, callback) =>
			socket.emit("card flip", id, callback),
		transform: (id, transform, callback) =>
			EmitPool.add("card transform", id, transform.data || transform, callback),
		lock: (id, locked, callback) =>
			socket.emit("card lock", id, locked, callback),
	},
	Deck: {
		get: (id, callback) =>
			socket.emit("get deck", id, callback),
		transform: (id, transform, callback) =>
			EmitPool.add("deck transform", id, transform.data || transform, callback),
		draw: (id, drag, callback) =>
			socket.emit("deck draw", id, drag, callback),
		shuffle: (id, callback) =>
			socket.emit("deck shuffle", id, callback),
		addCard: (id, cardId, callback) =>
			socket.emit("deck addCard", id, cardId, callback),
		newDeck: (...cardIds) => 
			socket.emit("deck create", cardIds),
		lock: (id, locked, callback) =>
			socket.emit("deck lock", id, locked, callback),
	},
	GameObject: {
		get: (id, callback) =>
			socket.emit("get object", id, callback),
		transform: (id, transform, callback) =>
			EmitPool.add("object transform", id, transform.data || transform, callback),
		lock: (id, locked, callback) =>
			socket.emit("object lock", id, locked, callback),
	},
	Dice: {
		get: (id, callback) =>
			socket.emit("get dice", id, callback),
		transform: (id, transform, callback) =>
			EmitPool.add("dice transform", id, transform.data || transform, callback),
		roll: (id, callback) =>
			socket.emit("dice roll", id, callback),
		set: (id, side, callback) =>
			socket.emit("dice set", id, side, callback),
		lock: (id, locked, callback) =>
			socket.emit("dice lock", id, locked, callback),
	},
	/** Cards that the player may hold */
	Hand: {
		add: (id, callback) =>
			socket.emit("hand add", id, callback),
		remove: (id, transform, callback) =>
			socket.emit("hand remove", id, transform, callback),
	},
	Mouse: {
		move: (position, callback) =>
			EmitPool.add("mouse move", position, callback),
		rotate: (rotation, callback) =>
			EmitPool.add("mouse rotate", rotation, callback),
	},
	Camera: {
		transform: (transform, callback) =>
			EmitPool.add("camera transform", transform.data || transform, callback),
	}
};