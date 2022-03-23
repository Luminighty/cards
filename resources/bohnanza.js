module.exports = function() {
	
	const beans = {
		"blackeyed": 10,
		"blue": 20,
		"chili": 18,
		"garden": 6,
		"green": 14,
		"red": 8,
		"soy": 12,
		"stink": 16,
	};
	/** @type {CardData[]} */
	const beanCards = [];
	for (const bean in beans) {
		const amount = beans[bean];
		const cards = Array(amount).fill({
			front: `bohnanza/${bean}.png`,
			back: `bohnanza/back.png`,
			flipped: true,
		});
		beanCards.push(...cards);
	}

	const fields = Array(10).fill({
		front: `bohnanza/field.png`,
		back: `bohnanza/field.png`,
	});

	/** @type {DeckData} */
	const mainDeck = {
		cards: beanCards,
		shuffle: true,
		position: {x: 300, y: 300}
	};

	/** @type {DeckData} */
	const fieldDeck = {
		cards: fields,
		position: {x: 600, y: 300}
	};
	return {
		cards: [],
		decks: [mainDeck, fieldDeck]
	};
};