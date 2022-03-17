const {id} = require("./id");

class Card {
	constructor(front, back) {
		this.id = id();
		this.front = front;
		this.back = back;
		this.flipped = false;
		this.position = Card.Position(this);
	}

	get image() {
		return this.flipped ? this.back : this.front;
	}

	simplified(player) {
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