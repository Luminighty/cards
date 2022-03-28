const GameObject = require("../game/objects/GameObject.js");
const {CreateObjectAction, AddTransformEvent, AddLockEvent} = require("./Action.js");


/** @type {ConnectionCallback} */
 function GameObjectConnection(socket, player, game) {

	AddTransformEvent(socket, "object transform", game, player, GameObjectAction);
	AddLockEvent(socket, "object lock", game, player, GameObjectAction);
	
}

/** @type {ObjectAction<GameObject>} */
const GameObjectAction = CreateObjectAction("objects", "set object");

module.exports = GameObjectConnection;