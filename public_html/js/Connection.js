const socket = io();

socket.on("set state", (data) => {
	console.log(data);
	setCards(data.cards);
	setDecks(data.decks);
	setMouses(data.hands);
	Hand.items = [];
});

socket.on("delete card", (id) => {
	const card = Card.Instances[id];
	if (!card) {
		console.error(`Card not found with ${id}`);
		return;
	}
	card.remove();
	delete Card.Instances[id];
});
socket.on("delete player", (id) => {
	console.log(`delete ${id}`);
	const mouse = PlayerMouse.Instances[id];
	if (!mouse) {
		console.error(`Mouse not found with ${id}`);
		return;
	}
	mouse.remove();
	delete PlayerMouse.Instances[id];
});

socket.on("delete deck", (id) => {
	const deck = Deck.Instances[id];
	if (!deck) {
		console.error(`Deck not found with ${id}`);
		return;
	}
	deck.remove();
	for(const id in Card.Instances) {
		const card = Card.Instances[id];
		if (card.grabbed())
			card.setZindex();
	}
	delete Deck.Instances[id];
});

const setCards = cards => setElements("card-element", Card.Instances, cards);
/** @returns {Card} */
const createCard = card => createElement("card-element", Card.Instances, card);
onSetElement("card", "card-element", Card.Instances, (card) => {
	card.setZindex();
});

const setDecks = decks => setElements("deck-element", Deck.Instances, decks);
/** @returns {Deck} */
const createDeck = deck => createElement("deck-element", Deck.Instances, deck);
onSetElement("deck", "deck-element", Deck.Instances);

const setMouses = mouses => setElements("player-mouse", PlayerMouse.Instances, mouses);
onSetElement("player", "player-mouse", PlayerMouse);

/**
 * @template T
 * @param {string} type 
 * @param {string} tagName 
 * @param {Object<number, T>} Instances 
 * @param {(element: T) => {}} callback 
 */
function onSetElement(type, tagName, Instances, callback) {
	socket.on(`set ${type}`, (data) => {
		const element = Instances[data.id] || createElement(tagName, Instances, data);
		element.set(data);
		if (callback)
			callback(element);
	});
}

function setElements(tagName, Instances, elements) {
	document.querySelectorAll(tagName).forEach((element) => element.remove());
	for (const data of elements)
		createElement(tagName, Instances, data);
}

function createElement(tagName, Instances, data) {
	const element = document.createElement(tagName);
	element.set(data);
	Instances[data.id] = element;
	element.style.position = "absolute";
	ElementContainer.appendChild(element);
	return element;
}


window.addEventListener("mousemove", (e) => {
	socket.emit("mouse move", Mouse.fromEvent(e));
});