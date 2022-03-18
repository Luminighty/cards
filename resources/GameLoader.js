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

/**
 * @typedef {Object} CardData
 * @property {string} front
 * @property {string} back
 * @property {boolean=} flipped
 * @property {{x: number, y: number}=} position
 */
/**
 * @typedef {Object} DeckData
 * @property {CardData[]} cards
 * @property {{x: number, y: number}=} position
 * @property {boolean=} shuffle
 */

/**
 * @typedef {Object} GameData
 * @property {CardData[]} cards
 * @property {DeckData[]} decks
 */

module.exports = {LoadGame, Games};