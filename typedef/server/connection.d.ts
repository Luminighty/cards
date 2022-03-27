
const Game = require("../../game/Game");
const Player = require("../../game/Player");
const { Socket } = require("socket.io");

type ObjectAction<T> = (game: Game, player: Player, callback: Function, id: number, action: (object: T) => SyncArgs) => void;

type ConnectionCallback = (socket: Socket, player: Player, game: Game) => void;