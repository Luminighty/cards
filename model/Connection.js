const { Socket } = require("socket.io");
const Game = require("./Game");
const Player = require("./Player");


/**
 * @param {Socket} socket 
 */
function Connection(socket) {
	const player = new Player(socket);
	player.join(Game.Instance);
	const game = player.game;

	socket.on('disconnect', () => {
		player.leave();
	});


	socket.emit("set state", player.gamestate);

	socket.on("card flip", (id, callback) => {
		CardAction(game, player, callback, id, (card) => card.flipped = !card.flipped);
	});

	socket.on("card move", (id, position, callback) => {
		CardAction(game, player, callback, id, (card) => card.position = position);
	});
}


function CardAction(game, player, callback, cardId, action) {
	const card = game.cards[cardId];
	action(card);
	if (callback)
		callback(card.simplified(player));
	game.syncCard(card, player);

}


module.exports = Connection;