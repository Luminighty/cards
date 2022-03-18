const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const Connection = require("./controller/Connection");
const Game = require("./game/Game");
const { LoadGame, Games } = require("./resources/GameLoader");
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

app.get("/set/:game", (req, res) => {
	SetGame(req.params.game);
	res.send("setting game");
});
app.get("/set", (req, res) => {
	const games = Object.keys(Games).map((name) => `<li>${name}</li>`);
	res.send(`<h1>Games</h1><ul>${games.join()}</ul>`);
});

const SetGame = (name) => Game.Instance.setGame(LoadGame(name));
