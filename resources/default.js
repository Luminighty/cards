module.exports = function() {
	const suits = ["clubs", "diamonds", "hearts", "spades"];
	const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "ace", "jack", "queen", "king"];
	const images = suits.flatMap((suit) => ranks.flatMap((rank) => `${rank}_of_${suit}`));

	const cards = images.map((image) => ({
		front: `default/${image}.png`, 
		back: "default/back.png",
		flipped: true,
	}));
	return {
		cards: [],
		decks: [{
			cards, 
			position: {x: 300, y: 300},
		}]
	};
};