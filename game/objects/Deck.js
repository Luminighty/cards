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
		this._transform = data.transform || {};
		this._transform.position = data.position || this._transform.position || {x: 0, y: 0};
		this._transform.rotation = data.rotation || this._transform.rotation || 0;
		this._transform.scale = data.scale || this._transform.scale || {x: 1, y: 1};
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
			transform: this.transform,
			cardCount: this.cards.length,
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