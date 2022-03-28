const cookie = require("cookie");
const cookieParser = require("cookie-parser");
const { Socket } = require("socket.io");
const Game = require("../game/Game");
const Card = require("../game/objects/Card");
const Deck = require("../game/objects/Deck");
const Player = require("../game/Player");
const Session = require("../oauth/session");
const Logger = require("../utils/logger");
const CardConnection = require("./Card");
const DeckConnection = require("./Deck");
const DiceConnection = require("./Dice");
const GameObjectConnection = require("./GameObject");
const HandConnection = require("./Hand");
const fetch = require("node-fetch");

/**
 * @param {Socket} socket 
 */
function Connection(socket) {
	const player = new Player(socket);
	player.join(Game.Instance);
	const game = player.game;

	// @ts-ignore
	const cookies = cookie.parse(socket.handshake.headers.cookie || '');
	const sessionId = cookieParser.signedCookie(cookies["session_id"], process.env["COOKIE_SIGNATURE"]);
	Session.find(sessionId)
	.then(GetUserData)
	.then((data) => {
		console.log(data);
		return data;
	})
	.then(player.set.bind(player))
	.then(() => {
		game.sync("set player", player, player);
	})
	.catch(console.error);


	socket.on('disconnect', () => {
		clearHand(socket, player, game);
		player.leave();
	});

	socket.on("mouse move", (position) => {
		player.mouse.position = position;
		game.sync("set player", player, player, {filter: ["id", "mouse"]});
	});
	socket.on("mouse rotate", (rotation) => {
		player.mouse.rotation = rotation;
		game.sync("set player", player, player, {filter: ["id", "mouse"]});
	});
	socket.on("camera transform", (transform) => {
		player.camera = transform;
		game.sync("set player", player, player, {filter: ["id", "camera"]});
	});

	socket.on("player data", (data, callback) => {
		player.set(data);
		game.sync("set player", player, player);
	});

	
	socket.prependAny(async (...args) => {
		Logger.log(player.id, ...args);
	});

	CardConnection(socket, player, game);
	HandConnection(socket, player, game);
	DeckConnection(socket, player, game);
	DiceConnection(socket, player, game);
	GameObjectConnection(socket, player, game);

	socket.emit("set state", player.gamestate);
}

/**
 * @param {Socket} socket 
 * @param {Player} player
 * @param {Game} game
 */
function clearHand(socket, player, game) {
	let i = 0;
	for (const item of player.hand) {
		const card = game.cards[item];
		card.playerHand = null;
		card.position = Card.Position({id: i});
		card.flipped = true;
		game.syncCard(card, player);
		i++;
	}
}

function GetUserData(session) {
	if(!session)
		return;
	// @ts-ignore
	return fetch("https://discord.com/api/users/@me", {headers: {
		authorization: `${session.type} ${session.access_token}`
	}})
	.then((result) => result.json())
	.then((res) => {
		if (res.code != null)
			throw res;
		return res;
	});
}

module.exports = Connection;