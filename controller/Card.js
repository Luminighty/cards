
/**
 * @param {Socket} socket 
 * @param {Player} player
 * @param {Game} game
 */
function CardConnection(socket, player, game) {
	socket.on("card flip", (id, callback) => {
		CardAction(game, player, callback, id, (card) => card.flipped = !card.flipped);
	});

	socket.on("card move", (id, transform, callback) => {
		CardAction(game, player, callback, id, (card) => {
			card.transform = transform;
			console.log(card.transform);
		});
	});
}


function CardAction(game, player, callback, cardId, action) {
	const card = game.cards[cardId];
	if (!card) {
		console.error(`Card not found: ${cardId}`);
		return;
	}
	const extra = action(card);
	if (callback)
		callback(card.simplified(player));
	game.syncCard(card, player, extra);
}

module.exports = CardConnection;