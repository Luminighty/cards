const Dice = require("../game/objects/Dice");
const { randomNumber } = require("../utils/shuffle");
const { CreateObjectAction, AddTransformEvent } = require("./Action");

/** @type {ConnectionCallback} */
function DiceConnection(socket, player, game) {
	AddTransformEvent(socket, "dice transform", game, player, DiceAction);
	
	socket.on("dice roll", (id, callback) => {
		DiceAction(game, player, callback, id, (dice) => {
			dice.side.x += randomNumber(1, Dice.MaxRoll) * Math.sign(Math.random() - 0.5);
			dice.side.y += randomNumber(1, Dice.MaxRoll) * Math.sign(Math.random() - 0.5);
			dice.side.index = randomNumber(0, dice.image.length);
			return { filter: ["id", "side"] };
		});
	});
}

/** @type {ObjectAction<Dice>} */
const DiceAction = CreateObjectAction("dices", "set dice");

module.exports = DiceConnection;