function LoadGame(name) {
	if (!Games[name])
		return null;
	const loader = require(`./${name}.js`);
	return loader();
}

const Games = {
	default: "default",
	bohnanza: "bohnanza",
};

module.exports = {LoadGame, Games};