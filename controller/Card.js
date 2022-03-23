const { Socket } = require("socket.io");
const Game = require("../game/Game.js");
const Card = require("../game/objects/Card");
const Player = require("../game/Player.js");

/**
 * @param {Socket} socket 
 * @param {Player} player
 * @param {Game} game
 */
function CardConnection(socket, player, game) {
	socket.on("card flip", (id, callback) => {
		CardAction(game, player, callback, id, (card) => {
			card.flipped = !card.flipped;
			return { extra: {flip: true}, filter: ["id", "image"]};
		});
	});

	socket.on("card transform", (id, transform, callback) => {
		CardAction(game, player, callback, id, (card) => {
			card.transform = transform;
			return { filter: ["id", "transform"] };
		});
	});
}

/**
 * @callback CardActionCallback
 * @param {Card} card
 * @returns {import("../game/Game.js").SyncArgs}
 */

/**
 * 
 * @param {Game} game 
 * @param {Player} player 
 * @param {Function} callback 
 * @param {number} cardId 
 * @param {CardActionCallback} action 
 * @returns 
 */
function CardAction(game, player, callback, cardId, action) {
	const card = game.cards[cardId];
	if (!card) {
		console.error(`Card not found: ${cardId}`);
		return;
	}
	const args = action(card);
	if (callback)
		callback(card.simplified(player));
	game.syncCard(card, player, args);
}

module.exports = CardConnection;