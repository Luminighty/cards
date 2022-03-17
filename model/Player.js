const { Socket } = require("socket.io");
const Game = require("./Game");

class Player {
	constructor(socket) {
		/** @type {Socket} */
		this.socket = socket;
		/** @type {Game} */
		this.game = null;
	}

	join(game) {
		this.game = game;
		game.join(this);
	}

	leave() {
		if (this.game)
			this.game.leave(this);
		this.game = null;
	}

	get gamestate() {
		if (!this.game)
			return null;
		const cards = Object.keys(this.game.cards).map((id) => this.game.cards[id].simplified(this));
		return {
			cards: cards,
		};
	}
}

module.exports = Player;