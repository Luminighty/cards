
/**
 * @typedef {CardDataType}
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
	}
}