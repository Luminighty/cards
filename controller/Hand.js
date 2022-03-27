const { Socket } = require("socket.io");
const Game = require("../game/Game");
const Player = require("../game/Player");

/** @type {ConnectionCallback} */
function HandConnection(socket, player, game) {
	socket.on("hand add", (id, callback) => {
		const card = game.cards[id];
		if (!card) {
			console.error(`Card not found: ${id}`);
			return;
		}
		card.playerHand = player.id;
		player.hand.push(id);
		game.sync("delete card", id, player);
		if (callback)
			callback(card.simplified(player));
	});

	socket.on("hand remove", (id, transform, callback) => {
		const card = game.cards[id];
		if (!card) {
			console.error(`Card not found: ${id}`);
			return;
		}
		const index = player.hand.findIndex((val) => val == id);
		if (index == -1) {
			console.error(`Card not in hand: ${id}`);
			return;
		}
		card.transform = transform;
		card.playerHand = null;
		player.hand.splice(index, 1);
		game.syncCard(card, player);
		if (callback)
			callback(card.simplified(player));
	});
}


module.exports = HandConnection;