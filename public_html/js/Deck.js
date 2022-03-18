class Deck extends HTMLElement {
	constructor() {
		super();
		const [wrapper, style] = Mixins.HTMLElement(this, Deck.HTML, Deck.CSS);

		/** @type {HTMLImageElement[]} */
		this._imageElements = Array.from(wrapper.querySelectorAll("img"));

		Mixins.Position(this);
		Mixins.Draggable(this);

		Mixins.Width(this, 100, ...this._imageElements);

		Mixins.HoverEvents(this);
	}

	set(deck) {
		this.id = deck.id || this.id;
		this.position = deck.position || this.position;
		if (deck.image)
			this.image = deck.image;
	}

	/** @param {KeyboardEvent} e */
	keyup(e) {
		if (e.key == "s" && this.hovering)
			DB.Deck.shuffle(this.id);
		
	}
	/** @param {MouseEvent} e */
	mousedown(e) {
		e.preventDefault();
		this.dragStart = Mouse.fromEvent(e);
		setTimeout(() => {
			if (!this.dragStart)
				return;
			const delta = Position.delta(this.dragStart, Mouse);
			if (delta < 5) {
				this.drag(e);
				this.dragStart = null;
			}
		}, 250);
	}

	/** @param {MouseEvent} e */
	mouseup(e) {
		this.drop(e);
		this.dragStart = null;
	}

	/** @param {MouseEvent} e */
	mousemove(e) {
		e.preventDefault();
		const mouse = Mouse.fromEvent(e);
		if (this.dragStart && Position.delta(mouse, this.dragStart) >= 5) {
			DB.Deck.draw(this.id, this.dragStart, (card, deck, drag) => {
				const element = createCard(card);
				element.setDrag(drag);
				element.setZindex();
				this.set(deck);
			});
			this.dragStart = null;
		}

		if (!this.grabbed())
			return;
		DB.Deck.move(this.id, this.position);
	}

	set image(value) {
		this._image = value;
		this._imageElements.forEach((img, index) => {
			img.src =  URL.Card(value[index] || "");
			img.style.display = value[index] ? "initial" : "none";
		});
	}

	get image() {
		return this._image;
	}

	get clientRects() {
		return this._imageElements.map((element) => element.getBoundingClientRect());
	}
}

Deck.HTML = `
<img id="third" />
<img id="second" />
<img id="first" />
`;

Deck.CSS = `
img#first {
	z-index: 0;
	left: 0px;
}
img#second {
	z-index: -1;
	left: -10px;
}
img#third {
	z-index: -2;
	left: -20px;
}
img {
    position: absolute;
	width: 100px;
	${CSS.UserSelect("none")}
}
`;


/** @type {Object<number, Deck>} */
Deck.Instances = {};
customElements.define('deck-element', Deck);

Mixins.MouseEvents(Deck.Instances);
Mixins.KeyboardEvents(Deck.Instances);
