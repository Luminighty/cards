const { Socket } = require("socket.io");
const Game = require("../game/Game.js");
const GameObject = require("../game/objects/GameObject.js");
const Player = require("../game/Player.js");


/**
 * @param {Socket} socket 
 * @param {Player} player
 * @param {Game} game
 */
 function GameObjectConnection(socket, player, game) {

	socket.on("object transform", (id, transform, callback) => {
		GameObjectAction(game, player, callback, id, (object) => {
			object.transform = transform;
			return { filter: ["id", "transform"] };
		});
	});
}



/**
 * @callback GameObjectActionCallback
 * @param {GameObject} card
 * @returns {import("../game/Game.js").SyncArgs}
 */

/**
 * 
 * @param {Game} game 
 * @param {Player} player 
 * @param {Function} callback 
 * @param {number} objectId 
 * @param {GameObjectActionCallback} action 
 * @returns 
 */
 function GameObjectAction(game, player, callback, objectId, action) {
	const object = game.objects[objectId];
	if (!object) {
		console.error(`Object not found: ${objectId}`);
		return;
	}
	const args = action(object);
	if (callback)
		callback(object.simplified(player));
	game.syncObject(object, player, args);
}

module.exports = GameObjectConnection;