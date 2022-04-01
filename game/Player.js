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
		this.username = "";
		this.color = "";
		this.discriminator = "";
		this.avatar = "";
		this.discordId = "";
	}

	set(data) {
		if (!data)
			return;
		this.username = data.username || this.username;
		this.discordId = data.id || this.discordId;
		this.discriminator = data.discriminator || this.discriminator;
		this.avatar = data.avatar || this.avatar;
		if (data.accent_color)
			this.color = data.accent_color.toString("16");
	}

	simplified(player) {
		return {
			id: this.id,
			mouse: this.mouse,
			username: this.username,
			discriminator: this.discriminator,
			color: this.color,
			camera: this.camera,
			hasAvatar: this.discordId != "",
		};
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
			objects: SimplifiedType(this.game.objects, this),
			dices: SimplifiedType(this.game.dices, this),
		};
	}

	clear() {
		this.hand = [];
	}

	emit(ev, ...args) {
		this.socket.emit(ev, ...args);
	}

}


const SimplifiedType = (map, player) =>
	Object.keys(map)
		.map((id) => map[id].simplified(player))
		.filter((value) => value != null);

module.exports = Player;