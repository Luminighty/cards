module.exports = function() {
	const suits = ["clubs", "diamonds", "hearts", "spades"];
	const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "ace", "jack", "queen", "king"];
	const images = suits.flatMap((suit) => ranks.flatMap((rank) => `${rank}_of_${suit}`));

	const cards = images.map((image) => ({
		front: `default/${image}.png`, 
		back: "default/back.png",
		flipped: true,
	}));

	const objs = {
		"zipchip_red": [1, 100, 100],
		"zipchip_green": [1, 300, 100],
		"zipchip_blue": [1, 500, 100],
		"zipchip_black": [1, 700, 100],
	};

	const objects = Object.entries(objs)
		.flatMap(([key, [amount, x, y]]) => 
			[...Array(amount)]
				.map((_, i) => ({
							image: `objects/${key}.png`, 
							position: {x: x + i * 10, y}
						})
					)
				);

	return {
		cards: [],
		decks: [{
			cards, 
			position: {x: 300, y: 300},
		}],
		objects
	};
};