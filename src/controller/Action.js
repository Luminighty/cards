const Game = require("../game/Game");
const Player = require("../game/Player.js");



/**
 * @template {Object} T
 * @param {string} type
 * @param {string} syncEvent
 * @returns {ObjectAction<T>}
 */
function CreateObjectAction(type, syncEvent) {
	return function(game, player, callback, id, action) {
		const object = game[type][id];
		if (!object) {
			console.error(`${type} not found: ${id}`);
			return;
		}
		const args = action(object);
		if (callback)
			callback(object.simplified(player));
		game.sync(syncEvent, object, player, args);
	};
}

function AddTransformEvent(socket, event, game, player, ObjectAction) {
	socket.on(event, (id, transform, callback) => {
		ObjectAction(game, player, callback, id, (object) => {
			object.transform = transform;
			return { filter: ["id", "transform"] };
		});
	});
}

function AddLockEvent(socket, event, game, player, ObjectAction) {
	socket.on(event, (id, locked, callback) => {
		ObjectAction(game, player, callback, id, (object) => {
			object.locked = locked;
			return { filter: ["id", "locked"] };
		});
	});
}

module.exports = {CreateObjectAction, AddTransformEvent, AddLockEvent};