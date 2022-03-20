const { Socket } = require("socket.io");
const Game = require("../game/Game");
const Deck = require("../game/objects/Deck");
const Player = require("../game/Player");


/**
 * @param {Socket} socket 
 * @param {Player} player
 * @param {Game} game
 */
function DeckConnection(socket, player, game) {

	socket.on("deck move", (id, transform, callback) => {
		DeckAction(game, player, callback, id, (deck) => deck.transform = transform);
	});

	socket.on("deck shuffle", (id, callback) => {
		DeckAction(game, player, callback, id, (deck) => {
			deck.shuffle();
			deck.updateImage(game.cards);
			socket.emit(`set deck`, deck.simplified(player));
			return { shuffle: true, };
		});
	});

	socket.on("deck addCard", (id, cardId, position, callback) => {
		DeckAction(game, player, callback, id, (deck) => {
			const card = game.cards[cardId];
			if (!card) {
				console.error(`Card not found: ${cardId}`);
				return;
			}
			deck.add(card, position);
			deck.updateImage(game.cards);
			game.broadcast("delete card", card.id);
			game.syncDeck(deck);
		});
	});

	socket.on("deck create", (cardIds, callback) => {
		const cards = cardIds.map((id) => game.cards[id]);
		console.log(cards);
		const deck = new Deck({
			cards,
			transform: cards[0].transform,
		});
		console.log(cards[0].transform);
		console.log(deck.transform);
		game.decks[deck.id] = deck;
		deck.updateImage(game.cards);
		game.syncDeck(deck);
		cards.forEach((card) => game.broadcast("delete card", card.id));
	});

	socket.on("deck draw", (id, drag, callback) => {
		const deck = game.decks[id];
		if (!deck) {
			console.error(`Deck not found: ${id}`);
			return;
		}
		const cardId = deck.draw();
		const card = game.cards[cardId];
		if (!card) {
			console.error(`Card not found: ${cardId}`);
			return;
		}
		deck.updateImage(game.cards);
		card.transform = deck.transform;
		card.deck = null;
		callback(card.simplified(player), deck.simplified(player), drag);

		game.syncCard(card, player);

		if (deck.cards.length < 2) {
			game.deleteDeck(deck);
		} else {
			game.syncDeck(deck, player);
		}
	});
}

function DeckAction(game, player, callback, deckId, action) {
	const deck = game.decks[deckId];
	if (!deck) {
		console.error(`Deck not found: ${deckId}`);
		return;
	}
	const extra = action(deck);
	if (callback)
		callback(deck.simplified(player));
	deck.updateImage(game.cards);
	game.syncDeck(deck, player, extra);
}

module.exports = DeckConnection;