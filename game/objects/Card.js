const {id} = require("../../utils/id");

class Card {
	constructor(data) {
		this.id = id();
		this.front = data.front;
		this.back = data.back;
		this.flipped = data.flipped || false;
		this.position = data.position || Card.Position(this);
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