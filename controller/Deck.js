const { Socket } = require("socket.io");
const Game = require("../game/Game");
const Deck = require("../game/objects/Deck");
const Player = require("../game/Player");
const {CreateObjectAction, AddTransformEvent} = require("./Action");


/** @type {ConnectionCallback} */
function DeckConnection(socket, player, game) {
	
	AddTransformEvent(socket, "deck transform", game, player, DeckAction);

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

/** @type {ObjectAction<Deck>} */
const DeckAction = CreateObjectAction("decks", "set deck");

module.exports = DeckConnection;