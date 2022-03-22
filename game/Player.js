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
		this.mouse = {
			position: {x: 0, y: 0,},
			rotation: 0,
		};
		this.camera = {
			position: {x: 0, y: 0,},
			rotation: 0,
			scale: 1,
		};
		this.name = "";
		this.color = `${Math.floor(Math.random()*360)}`;
	}

	set(data) {
		this.name = data.name || this.name;
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
			hands: SimplifiedType(this.game.players.filter((val) => val.id != this.id), this),
		};
	}

	clear() {
		this.hand = [];
	}

	emit(...args) {
		this.socket.emit(...args);
	}

	simplified(player) {
		return {
			id: this.id,
			mouse: this.mouse,
			name: this.name,
			color: this.color,
			camera: this.camera,
		};
	}
}


const SimplifiedType = (map, player) =>
	Object.keys(map)
		.map((id) => map[id].simplified(player))
		.filter((value) => value != null);

module.exports = Player;