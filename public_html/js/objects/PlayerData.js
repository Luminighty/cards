const PlayerData = {};


const playerName = getCookie("name");
if (!playerName) {
	setCookie("name", prompt("Username"), 7);
} else {
	PlayerData.name = playerName;
}


socket.emit("player data", PlayerData);