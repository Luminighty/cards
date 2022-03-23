
/**
 * @typedef {Object} CardDataType
 * @property {number} id
 * @property {string} front
 * @property {string} back
 * @property {boolean} flipped
 */


const Resource = {
	Card: (value) => value ? `res/${value}` : "",
}

const DB = {
	Card: {
		get: (id, callback) =>
			socket.emit("get card", id, callback),
		flip: (id, callback) =>
			socket.emit("card flip", id, callback),
		transform: (id, transform, callback) =>
			EmitPool.add("card transform", id, transform.data || transform, callback)
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

}