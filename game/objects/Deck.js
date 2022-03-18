const { shuffle } = require("../../utils/shuffle");
const Card = require("./Card");
const { id } = require("../../utils/id");

class Deck {
	/**
	 * @param {Object} data 
	 * @param {Array<(Card | number)>} [data.cards=[]]
	 * @param {{x: number, y: number}} [data.position={x:0, y:0}]
	 * @param {boolean} [data.shuffle=false]
	 */
	constructor(data = {}) {
		this.id = id();
		this.cards = [];
		this.position = data.position || {x: 0, y: 0};
		this.image = [];
		if (data.cards)
			this.addCards(...data.cards);
		if (data.shuffle)
			this.shuffle();
	}

	/** 
	 * @param  {Card} card 
	 * @param {("TOP"|"BOTTOM"|"RANDOM"|number)} position 
	 */
	add(card, position = "TOP") {
		position = (position == null) ? "TOP" : position;
		let index = position == "TOP" ? this.cards.length
					: position == "BOTTOM" ? 0
					: position == "RANDOM" ? Math.floor(Math.random() * this.cards.length)
					: position;
		card.deck = this.id;
		this.cards.splice(index, 0, card.id);
	}

	/** @param  {...Card} cards */
	addCards(...cards) {
		cards = cards.map((card) => {
			card.deck = this.id;
			return card.id;
		});
		this.cards.push(...cards);
	}

	/** @returns {number} card.id */
	remove(index) {
		return this.cards.splice(index, 1)[0];
	}

	/** @returns {number} card.id */
	draw() {
		return this.cards.pop();
	}

	shuffle() {
		shuffle(this.cards);
	}

	simplified(player) {
		return {
			id: this.id,
			image: this.image,
			position: this.position,
		};
	}

	/** @param {Object<number, Card>} cards */
	updateImage(cards) {
		const cardIds = this.cards.slice(-3);
		this.image = cardIds.map((id) => cards[id] && cards[id].image).filter((value) => value != null);
	}
}

module.exports = Deck;