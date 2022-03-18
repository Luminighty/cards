class Card extends HTMLElement {
	constructor() {
		super();
		const [wrapper, _] = Mixins.HTMLElement(this, Card.HTML, Card.CSS);

		/** @type {HTMLImageElement} */
		this._imageElement = wrapper.firstElementChild;

		Mixins.Draggable(this);
		Mixins.Position(this);
		Mixins.Width(this, 100, this._imageElement);

		Mixins.HoverEvents(this);
	}

	remove() {
		super.remove();
	}

	set(card) {
		this.id = (card.id != null) ? card.id : this.id;
		this.image = card.image || this.image;
		this.position = card.position || this.position;
	}

	/** @param {KeyboardEvent} e */
	keyup(e) {
		if (e.key == "f" && this.hovering) {
			DB.Card.flip(this.id, (res) => {
				this.set(res);
			});
		}
	}

	setZindex() {
		const length = Object.keys(Card.Instances).length;
		const lastzIndex = this.zIndex;
		if (parseInt(this.style.zIndex) != length) {
			for (const key in Card.Instances) {
				const card = Card.Instances[key];
				const zIndex = card.zIndex;
				if (zIndex > lastzIndex)
					card.zIndex = zIndex - 1;
			}
			this.zIndex = length;
		}
	}

	get zIndex() {
		return parseInt(this.style.zIndex || 0);
	}

	set zIndex(value) {
		this.style.zIndex = value;
	}

	/** @param {MouseEvent} e */
	mousedown(e) {
		e.preventDefault();
		this.drag(e);
		this.setZindex();
	}

	/** @param {MouseEvent} e */
	mouseup(e) {
		const mouse = Mouse.fromEvent(e);
		if (this.grabbed())
		for(const id in Deck.Instances) {
			const deck = Deck.Instances[id];
			if (deck.clientRects.some((rect) => Rect.contains(rect, mouse))) {
				DB.Deck.addCard(deck.id, this.id);
				console.log("Add card");
				break;
			}
		}
		this.drop(e);
	}

	/** @param {MouseEvent} e */
	mousemove(e) {
		if (!this.grabbed())
			return;
		e.preventDefault();

		DB.Card.move(this.id, this.position);
	}

	set image(value) { 
		this._image = value;
		this._imageElement.src = URL.Card(value);
	}

	get image() { return this._image; }
}

Card.HTML = `
<img />
`;

Card.CSS = `
img {
	${CSS.UserSelect("none")}
}
`;

/** @type {Object<number, Card>} */
Card.Instances = {};
customElements.define('card-element', Card);

Mixins.MouseEvents(Card.Instances);
Mixins.KeyboardEvents(Card.Instances);