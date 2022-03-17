const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Connection = require("./model/Connection");

const PORT = 3000;

app.use(express.static('public_html'));

app.use("/res", express.static('resources/'));

io.on("connection", Connection);

server.listen(3000, () => {
	console.log(`listening on http://localhost:${PORT}/`);
});
