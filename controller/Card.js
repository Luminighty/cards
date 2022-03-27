const { Socket } = require("socket.io");
const Game = require("../game/Game.js");
const Card = require("../game/objects/Card");
const Player = require("../game/Player.js");
const {CreateObjectAction, AddTransformEvent} = require("./Action.js");

/** @type {ConnectionCallback} */
function CardConnection(socket, player, game) {
	AddTransformEvent(socket, "card transform", game, player, CardAction);

	socket.on("card flip", (id, callback) => {
		CardAction(game, player, callback, id, (card) => {
			card.flipped = !card.flipped;
			return { extra: {flip: true}, filter: ["id", "image"]};
		});
	});
}

/** @type {ObjectAction<Card>} */
const CardAction = CreateObjectAction("cards", "set card");

module.exports = CardConnection;