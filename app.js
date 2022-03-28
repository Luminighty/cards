require('dotenv').config();
const path = require("path");
const express = require("express");
const app = express();
const Game = require("./game/Game");
const { LoadGame, Games } = require("./resources/GameLoader");
const { discordAuth } = require('./oauth');
const cookieParser = require("cookie-parser");

app.use(cookieParser(process.env["COOKIE_SIGNATURE"]));
app.use("/", discordAuth);
app.use(express.static(path.join(__dirname, "public_html")));
app.use("/res", express.static(path.join(__dirname, "resources/")));

app.post("/set/:game/:key", (req, res) => {
	if (req.params.key != process.env["ADMIN_KEY"]) {
		res.send("Invalid key");
		return;
	}
	const game = SetGame(req.params.game);
	if (game == null) {
		res.send("Game not found");
	} else {
		res.send(`Setting game to ${req.params.game}`);
	}
});

app.get("/avatar/:id", (req, res) => {
	const {id} = req.params;
	const player = Game.Instance.players.find((player) => player.id == parseInt(id));
	if (player) {
		res.redirect(`https://cdn.discordapp.com/avatars/${player.discordId}/${player.avatar}.png?size=32`);
	} else {
		res.redirect("img/cursor.png");
	}
});

app.get("/set", (req, res) => {
	const games = Object.keys(Games).map((name) => `<li>${name}</li>`);
	res.send(`<h1>Games</h1><ul>${games.join('')}</ul>`);
});

const SetGame = (name) => Game.Instance.setGame(LoadGame(name));

module.exports = { app, SetGame };