require('dotenv').config();
const http = require("http");
const { Server } = require("socket.io");

const Connection = require("./src/controller/Connection");
const { Games } = require("./resources/GameLoader");
const { SetGame, app } = require('./app');
const Session = require('./src/oauth/session');

const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "";

io.on("connection", Connection);

Session.load()
.then(() => {
	SetGame(Games.default);
	server.listen(PORT, () => {
		console.log(`listening on port ${PORT}`);
		console.log(`${HOST}:${PORT}`);
	});
})