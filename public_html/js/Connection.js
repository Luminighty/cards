// @ts-ignore
const socket = io();

socket.on("set state", (data) => {
	console.log("Setting state...");
	console.log(data);
	setCards(data.cards);
	setDecks(data.decks);
	setMouses(data.hands);
	setObjects(data.objects);
	setDices(data.dices);
	Hand.items = [];
});


// ////////////////
//      CARDS
// ///////////////
const setCards = cards => setElements("card-element", Card.Instances, cards);
/** @returns {Card} */
const createCard = card => createElement("card-element", Card.Instances, card);
onSetElement("card", "card-element", Card.Instances, (card) => {
	card.setZIndex();
});
onDeleteElement("card", Card.Instances);


// ////////////////
//      DECKS
// ///////////////
const setDecks = decks => setElements("deck-element", Deck.Instances, decks);
/** @returns {Deck} */
const createDeck = deck => createElement("deck-element", Deck.Instances, deck);
onSetElement("deck", "deck-element", Deck.Instances);
onDeleteElement("deck", Deck.Instances, (deck, id) => {
	for(const id in Card.Instances) {
		const card = Card.Instances[id];
		if (card.grabbed())
			card.setZIndex();
	}
});


// ////////////////
//      OBJECTS
// ///////////////
const setObjects = objects => setElements("game-object", GameObject.Instances, objects);
/** @returns {GameObject} */
const createObject = object => createElement("game-object", GameObject.Instances, object);
onSetElement("object", "game-object", GameObject.Instances);
onDeleteElement("object", GameObject.Instances);


// ////////////////
//      MOUSES
// ///////////////
const setMouses = mouses => setElements("player-mouse", PlayerMouse.Instances, mouses);
onSetElement("player", "player-mouse", PlayerMouse.Instances, (mouse) => {
	mouse.style.zIndex = 99999;
});
onDeleteElement("player", PlayerMouse.Instances);


// ////////////////
//      DICES
// ///////////////
const setDices = dices => setElements("dice-element", Dice.Instances, dices);
/** @returns {Dice} */
const createDice = dice => createElement("dice-element", Dice.Instances, dice);
onSetElement("dice", "dice-element", Dice.Instances);
onDeleteElement("dice", Dice.Instances);


/**
 * @param {string} type 
 * @param {string} tagName 
 * @param {Object<string, Object>} Instances 
 * @param {(element: Object) => void=} callback 
 */
function onSetElement(type, tagName, Instances, callback) {
	socket.on(`set ${type}`, (data) => {
		const element = Instances[data.id] || createElement(tagName, Instances, data);
		element.set(data);
		if (element.transition)
			element.transition.transform = `${EmitPool.delay + EmitPool.transitionDelay}ms ease-out`;
		if (callback)
			callback(element);
	});
}

/**
 * @param {string} type 
 * @param {Object<string, Object>} Instances 
 * @param {(element: Object, id: number) => void=} callback 
 */
function onDeleteElement(type, Instances, callback) {
	socket.on(`delete ${type}`, (id) => {
		const element = Instances[id];
		if (!element) {
			console.error(`${type} not found with ${id}`);
			return;
		}
		if (callback)
			callback(element, id);
		element.remove();
		delete Instances[id];
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


socket.on("set delay", (delay, transitionDelay) => {
	if (delay != null)
		EmitPool.delay = delay;
	if (transitionDelay != null)
		EmitPool.transitionDelay = transitionDelay;
});

const EmitPool = {
	items: {},
	logging: false,
	transitionDelay: 100,
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
