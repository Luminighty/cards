const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const Connection = require("./controller/Connection");
const io = new Server(server);

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public_html")));
app.use("/res", express.static(path.join(__dirname, "resources/")));

io.on("connection", Connection);

server.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});
