const { shuffle } = require("../../utils/shuffle");
const Card = require("./Card");
const { id } = require("../../utils/id");

class Deck {
	
	/**
	 * @param {DeckData=} data 
	 */
	constructor(data = {}) {
		this.id = id();
		/** @type {number[]} */
		this.cards = [];
		this._transform = {
			position: data.position || {x: 0, y: 0},
			rotation: data.rotation || 0,
			scale: data.scale || {x: 1, y: 1},
		};
		/** @type {string[]} */
		this.image = [];
		if (data.shuffle)
			this.shuffle();
		this.locked = false;
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
		const ids = cards.map((card) => {
			card.deck = this.id;
			return card.id;
		});
		this.cards.push(...ids);
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
			transform: this.transform,
			cardCount: this.cards.length,
			locked: this.locked,
		};
	}

	/** @param {Object<number, Card>} cards */
	updateImage(cards) {
		const cardIds = this.cards.slice(-3);
		this.image = cardIds.map((id) => cards[id] && cards[id].image).filter((value) => value != null);
	}

	set position(value) { this.transform.position = value; }
	get position() { return Object.assign({}, this._transform.position); }
	
	set rotation(value) { this.transform.rotation = value; }
	get rotation() { return this._transform.rotation; }
	
	set scale(value) { this.transform.scale = value; }
	get scale() { return Object.assign({}, this._transform.scale); }

	set transform(value) { this._transform = value; }
	get transform() { 
		return {
			position: this.position,
			rotation: this.rotation,
			scale: this.scale,
		};
	}
}

module.exports = Deck;