const Card = require("./model/Card");

function loadCards() {
	const suits = ["clubs", "diamonds", "hearts", "spades"];
	const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "ace", "jack", "queen", "king"];
	const images = suits.flatMap((suit) => ranks.flatMap((rank) => `${rank}_of_${suit}`));

	const cards = images.map((image) => new Card(image, "back"));
	const cardMap = {};
	cards.forEach((card) => cardMap[card.id] = card);
	return cardMap;
}

module.exports = {loadCards};