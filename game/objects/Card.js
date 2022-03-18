const {id} = require("../../utils/id");

class Card {
	constructor(front, back, flipped) {
		this.id = id();
		this.front = front;
		this.back = back;
		this.flipped = flipped || false;
		this.position = Card.Position(this);
		this.deck = null;
	}

	get image() {
		return this.flipped ? this.back : this.front;
	}

	simplified(player) {
		if (this.deck != null)
			return null;
		return {
			id: this.id,
			image: this.image,
			position: this.position,
		};
	}
}

Card.Position = (card) => {
	return {
		x: card.id * 30,
		y: 10,
	};
};

module.exports = Card;