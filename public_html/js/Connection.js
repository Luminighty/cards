const socket = io();

socket.on("set state", (data) => {
	console.log(data);
	setCards(data.cards);
});

socket.on("set card", (data) => {
	const card = Card.Instances[data.id];
	card.set(data);
});


function setCards(cards) {
	document.querySelectorAll("card-element").forEach((element) => element.remove());

	for (const card of cards) {
		const element = document.createElement("card-element");
		element.set(card);
		Card.Instances[card.id] = element;

		element.style.position = "absolute";
		document.body.appendChild(element);
	}
}