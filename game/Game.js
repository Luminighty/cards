const { loadCards } = require("../ResourceLoader");
const Card = require("./objects/Card");
const Deck = require("./objects/Deck");
const Player = require("./Player");

class Game {
	constructor() {
		/** @type {Player[]} */
		this.players = [];
		/** @type {Object<number, Card>} */
		this.cards = loadCards() || {};
		/** @type {Object<number, Deck>} */
		this.decks = {};
		const deck = this.add(new Deck({
			cards: Object.values(this.cards),
			shuffle: false,
			position: {x: 300, y: 300},
		}));
		deck.updateImage(this.cards);
	}

	/**
	 * @template T
	 * @param {T} element 
	 * @returns {T}
	 */
	add(element) {
		if (element instanceof Deck)
			this.decks[element.id] = element;
		if (element instanceof Card)
			this.cards[element.id] = element;
		return element;
	}

	join(player) {
		this.players.push(player);
	}

	leave(player) {
		const index = this.players.indexOf(player);
		this.players.splice(index, 1);
	}

	sync(type, data, sender) {
		for (const player of this.players)
			if (sender != player)
				player.socket.emit(`set ${type}`, data.simplified(player));
	}

	syncCard(card, sender) {
		this.sync("card", card, sender);
	}
	syncDeck(deck, sender) {
		this.sync("deck", deck, sender);
	}

	// Resets the state for everyone
	refresh() {}

	broadcast(...data) {
		for (const player of this.players) player.socket.emit(...data);
	}

	/** @param {Deck} deck */
	deleteDeck(deck) {
		delete this.decks[deck.id];
		deck.cards.forEach((cardId, index) => {
			const card = this.cards[cardId];
			card.deck = null;
			card.position = deck.position
			card.position.x += index * 5;
			this.syncCard(card);
		});
		this.broadcast("delete deck", deck.id);
	}
}

Game.Instance = new Game();

module.exports = Game;
