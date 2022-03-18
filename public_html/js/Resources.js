
/**
 * @typedef {Object} CardDataType
 * @property {number} id
 * @property {string} front
 * @property {string} back
 * @property {boolean} flipped
 */


const URL = {
	Card: (value) => value ? `res/cards/${value}.png` : "",
}

const DB = {
	Card: {
		get: (id, callback) => {
			socket.emit("get card", id, callback);
		},
		flip: (id, callback) => {
			socket.emit("card flip", id, callback);
		},
		move: (id, position, callback) => {
			socket.emit("card move", id, position, callback);
		}
	},
	Deck: {
		get: (id, callback) => {
			socket.emit("get deck", id, callback);
		},
		move: (id, position, callback) => {
			socket.emit("deck move", id, position, callback);
		},
		draw: (id, drag, callback) => {
			socket.emit("deck draw", id, drag, callback);
		},
		shuffle: (id, callback) => {
			socket.emit("deck shuffle", id, callback);
		},
		addCard: (id, cardId, callback) => {
			socket.emit("deck addCard", id, cardId, callback);
		},
		newDeck: (...cardIds) => {
			socket.emit("deck create", cardIds);
		},
	},
	Hand: {
		add: (id, callback) => {
			socket.emit("hand add", id, callback);
		},
		remove: (id, callback) => {
			socket.emit("hand remove", id, callback);
		},
	}
}