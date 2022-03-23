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

	socket.on("deck transform", (id, transform, callback) => {
		DeckAction(game, player, callback, id, (deck) => {
			deck.transform = transform;
			return {filter: ["id", "transform"]};
		});
	});

	socket.on("deck shuffle", (id, callback) => {
		DeckAction(game, player, callback, id, (deck) => {
			deck.shuffle();
			deck.updateImage(game.cards);
			socket.emit(`set deck`, deck.simplified(player));
			return { extra: {shuffle: true,}, filter: ["id", "image"] };
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
			return { filter: ["id", "image", "cardCount"] };
		});
	});

	socket.on("deck create", (cardIds, callback) => {
		const cards = cardIds.map((id) => game.cards[id]);
		const deck = new Deck();
		deck.addCards(...cards);
		deck.transform = cards[0].transform;
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
			game.syncDeck(deck, player, {filter: ["id", "image", "cardCount"]});
		}
	});
}

/**
 * @callback DeckActionCallback
 * @param {Deck} card
 * @returns {import("../game/Game.js").SyncArgs}
 */

/**
 * 
 * @param {Game} game 
 * @param {Player} player 
 * @param {Function} callback 
 * @param {number} deckId 
 * @param {DeckActionCallback} action 
 * @returns 
 */
function DeckAction(game, player, callback, deckId, action) {
	const deck = game.decks[deckId];
	if (!deck) {
		throw `Deck not found: ${deckId}`;
	}
	const args = action(deck);
	if (callback)
		callback(deck.simplified(player));
	deck.updateImage(game.cards);
	game.syncDeck(deck, player, args);
}

module.exports = DeckConnection;