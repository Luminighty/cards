require('dotenv').config();
const path = require("path");
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const Game = require("./game/Game");
const Connection = require("./controller/Connection");
const { LoadGame, Games } = require("./resources/GameLoader");

const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public_html")));
app.use("/res", express.static(path.join(__dirname, "resources/")));

io.on("connection", Connection);

server.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
	console.log(`http://localhost:${PORT}`);
	SetGame(Games.default);
});

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
app.get("/set", (req, res) => {
	const games = Object.keys(Games).map((name) => `<li>${name}</li>`);
	res.send(`<h1>Games</h1><ul>${games.join('')}</ul>`);
});

const SetGame = (name) => Game.Instance.setGame(LoadGame(name));
