const {id} = require("../../utils/id");

class Card {
	/**
	 * @param {CardData} data 
	 */
	constructor(data) {
		this.id = id();
		this.front = data.front;
		this.back = data.back;
		this.flipped = data.flipped || false;
		this._transform = {
			position: data.position || Card.Position(this),
			rotation: data.rotation || 0,
			scale: data.scale || {x: 1, y: 1},
		};
		this.deck = null;
		this.playerHand = null;
		this.locked = false;
	}

	get image() {
		return this.flipped ? this.back : this.front;
	}

	simplified(player) {
		if (this.deck != null)
			return null;
		if (this.playerHand != null && this.playerHand != player.id)
			return null;
		return {
			id: this.id,
			image: this.image,
			transform: this.playerHand == null ? this.transform : null,
			locked: this.locked,
		};
	}

	set position(value) { this.transform.position = value; }
	get position() { return this._transform.position; }
	
	set rotation(value) { this.transform.rotation = value; }
	get rotation() { return this._transform.rotation; }
	
	set scale(value) { this.transform.scale = value; }
	get scale() { return this._transform.scale; }

	set transform(value) { this._transform = Object.assign({}, value); }
	get transform() {  return this._transform;}
}

Card.Position = (card) => {
	return {
		x: card.id * 30,
		y: 10,
	};
};

module.exports = Card;