const { Socket } = require("socket.io");
const Game = require("../game/Game.js");
const GameObject = require("../game/objects/GameObject.js");
const Player = require("../game/Player.js");
const {CreateObjectAction, AddTransformEvent} = require("./Action.js");


/** @type {ConnectionCallback} */
 function GameObjectConnection(socket, player, game) {

	AddTransformEvent(socket, "object transform", game, player, GameObjectAction);
	
}

/** @type {ObjectAction<GameObject>} */
const GameObjectAction = CreateObjectAction("objects", "set object");

module.exports = GameObjectConnection;