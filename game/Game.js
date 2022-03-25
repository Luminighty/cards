const Card = require("./objects/Card");
const Deck = require("./objects/Deck");
const GameObject = require("./objects/GameObject");
const Player = require("./Player");
const Logger = require("../utils/logger");

/**
 * @typedef {Object} SyncArgs
 * @property {Object=} extra Extra information to attach
 * @property {string[]=} filter Which fields to send
 */

class Game {
	constructor() {
		/** @type {Player[]} */
		this.players = [];
		/** @type {Object<number, Card>} */
		this.cards = {};
		/** @type {Object<number, Deck>} */
		this.decks = {};
		/** @type {Object<number, GameObject>} */
		this.objects = {};
	}

	/** @param {GameData} gameData */
	setGame(gameData) {
		if (!gameData) return;
		this.cards = {};
		this.decks = {};
		this.objects = {};

		for (const data of gameData.cards) {
			const card = new Card(data);
			this.cards[card.id] = card;
		}

		for (const data of gameData.decks) {
			const cards = data.cards.map((v) => new Card(v));
			cards.forEach((card) => (this.cards[card.id] = card));
			const deck = new Deck(data);
			deck.addCards(...cards);
			this.decks[deck.id] = deck;
			deck.updateImage(this.cards);
		}

		for (const data of gameData.objects) {
			const object = new GameObject(data);
			this.objects[object.id] = object;
		}

		this.refresh();
		return this;
	}

	/**
	 * @template T
	 * @param {T} element
	 * @returns {T}
	 */
	add(element) {
		if (element instanceof Deck) this.decks[element.id] = element;
		if (element instanceof Card) this.cards[element.id] = element;
		return element;
	}

	join(player) {
		this.players.push(player);
	}

	leave(player) {
		const index = this.players.indexOf(player);
		this.players.splice(index, 1);
		this.sync("delete player", player.id, player);
	}

	/**
	 *
	 * @param {string} type
	 * @param {*} data
	 * @param {Player} sender
	 * @param {SyncArgs} args
	 */
	sync(type, data, sender, args = {}) {
		for (const player of this.players) {
			if (sender != player) {
				let sendData =
					data.simplified != null ? data.simplified(player) : data;
				if (sendData == null) 
					continue;

				if (args.filter)
					sendData = Object.keys(sendData)
						.filter(key => args.filter.includes(key))
						.reduce((obj, key) => ({...obj, [key]: sendData[key]}), {});

				if (args.extra) 
					Object.assign(sendData, args.extra);

				player.socket.emit(type, sendData);
				Logger.log(`sync ${type}`, sendData);
			}
		}
	}

	/**
	 * @param {Card} card 
	 * @param {Player=} sender 
	 * @param {SyncArgs=} extra 
	 */
	 syncCard(card, sender, extra) {
		this.sync("set card", card, sender, extra);
	}
	/**
	 * @param {Object} card 
	 * @param {Player=} sender 
	 * @param {SyncArgs=} extra 
	 */
	syncObject(card, sender, extra) {
		this.sync("set object", card, sender, extra);
	}

	/**
	 * @param {Deck} deck 
	 * @param {Player=} sender 
	 * @param {SyncArgs=} extra 
	 */
	syncDeck(deck, sender, extra) {
		this.sync("set deck", deck, sender, extra);
	}

	// Resets the state for everyone
	refresh() {
		for (const player of this.players) {
			player.clear();
			player.emit("set state", player.gamestate);
		}
	}

	broadcast(ev, ...data) {
		for (const player of this.players) player.socket.emit(ev, ...data);
	}

	/** @param {Deck} deck */
	deleteDeck(deck) {
		delete this.decks[deck.id];
		deck.cards.forEach((cardId, index) => {
			const card = this.cards[cardId];
			card.deck = null;
			card.position = deck.position;
			card.position.x += index * 5;
			this.syncCard(card);
		});
		this.broadcast("delete deck", deck.id);
	}
}

Game.Instance = new Game();

module.exports = Game;
