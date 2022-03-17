const { loadCards } = require("../ResourceLoader");
const Card = require("./Card");
const Player = require("./Player");

class Game {
	constructor() {
		/** @type {Player[]} */
		this.players = [];
		this.cards = loadCards();
	}

	join(player) {
		this.players.push(player);
	}

	leave(player) {
		const index = this.players.indexOf(player);
		this.players.splice(index, 1);
	}

	syncCard(card, sender) {
		for (const player of this.players)
		if (sender != player)
			player.socket.emit("set card", card.simplified(player));
	}

	// Resets the state for everyone
	refresh() {

	}

	broadcast(...data) {
		for (const player of this.players)
			player.socket.emit(...data);
	}
}

Game.Instance = new Game();

module.exports = Game;