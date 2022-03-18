const {id} = require("../../utils/id");

class Card {
	constructor(front, back, flipped) {
		this.id = id();
		this.front = front;
		this.back = back;
		this.flipped = flipped || false;
		this.position = Card.Position(this);
		this.deck = null;
		this.playerHand = null;
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
			position: this.playerHand == null ? this.position : null,
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