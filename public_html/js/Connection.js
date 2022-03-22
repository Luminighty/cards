const socket = io();

socket.on("set state", (data) => {
	console.log("Setting state...");
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
onSetElement("player", "player-mouse", PlayerMouse.Instances, (mouse) => {
	mouse.style.zIndex = 99999;
});

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
		if (element.transition)
			element.transition.transform = `${EmitPool.delay * 2}ms ease-out`;
		if (callback)
			callback(element);
	});
}

function setElements(tagName, Instances, elements) {
	document.querySelectorAll(tagName).forEach((element) => element.remove());
	for (const key in Instances)
		delete Instances[key];
	for (const data of elements)
		createElement(tagName, Instances, data);
}

function createElement(tagName, Instances, data) {
	if (Instances[data.id])
		return Instances[data.id];
	const element = document.createElement(tagName);
	element.set(data);
	Instances[data.id] = element;
	element.style.position = "absolute";
	ElementContainer.appendChild(element);
	return element;
}


const EmitPool = {
	items: {},
	logging: false,
	add(type, ...args) {
		if (!this.items[type])
			this.items[type] = [];
		this.items[type].push(args);
	},
	emitAll() {
		const saved = {};
		for (const key in this.items) {
			const arr = this.items[key];
			const args = arr[arr.length - 1] || [];
			saved[key] = arr.length;
			socket.emit(key, ...args);
		}
		this.items = {};
		if (this.logging && Object.keys(saved).length != 0)
			console.log(saved);
	},
	set delay(value) {
		this._delay = value;
		if (this.interval != null)
			clearInterval(this.interval);
		this.interval = setInterval(() => {
			EmitPool.emitAll();
		}, value);
	},
	get delay() {
		return this._delay;
	}
};
EmitPool.delay = 100;


