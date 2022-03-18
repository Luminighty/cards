const { Socket } = require("socket.io");
const { idGroup } = require("../utils/id");
const Game = require("./Game");

const playerId = idGroup();

class Player {
	constructor(socket) {
		/** @type {Socket} */
		this.socket = socket;
		/** @type {Game} */
		this.game = null;
		this.id = playerId();
		this.hand = [];
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
		return {
			cards: SimplifiedType(this.game.cards, this),
			decks: SimplifiedType(this.game.decks, this),
		};
	}
}


const SimplifiedType = (map, player) =>
	Object.keys(map)
		.map((id) => map[id].simplified(player))
		.filter((value) => value != null);

module.exports = Player;