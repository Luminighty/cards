const { loadCards } = require("../resources/GameLoader");
const Card = require("./objects/Card");
const Deck = require("./objects/Deck");
const Player = require("./Player");

class Game {
	constructor() {
		/** @type {Player[]} */
		this.players = [];
		/** @type {Object<number, Card>} */
		this.cards = {};
		/** @type {Object<number, Deck>} */
		this.decks = {};
	}

	/** @param {import("../resources/GameLoader").GameData} gameData */
	setGame(gameData) {
		if (!gameData)
			return;
		this.cards = {};
		this.decks = {};

		for (const data of gameData.cards) {
			const card = new Card(data);
			this.cards[card.id] = card;
		}

		for (const data of gameData.decks) {
			data.cards = data.cards.map((v) => new Card(v));
			data.cards.forEach((card) => this.cards[card.id] = card);
			const deck = new Deck(data);
			this.decks[deck.id] = deck;
			deck.updateImage(this.cards);
		}

		for (const player of this.players) {
			player.clear();
			player.emit("set state", player.gamestate);
		}
		return this;
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

	sync(type, data, sender, extra) {
		for (const player of this.players) {
			if (sender != player) {
				const sendData = data.simplified != null ? data.simplified(player) : data;
				if (extra)
					Object.assign(sendData, extra);
				if (sendData != null)
					player.socket.emit(type, sendData);
			}
		}
	}

	syncCard(card, sender, extra) {
		this.sync("set card", card, sender, extra);
	}
	syncDeck(deck, sender, extra) {
		this.sync("set deck", deck, sender, extra);
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
