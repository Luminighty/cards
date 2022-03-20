class Card extends HTMLElement {
	constructor() {
		super();
		const [wrapper, _] = Mixins.HTMLElement(this, Card.HTML, Card.CSS);

		/** @type {HTMLImageElement} */
		this._imageElement = wrapper.firstElementChild;

		Mixins.Draggable(this);
		Mixins.Transform(this);
		Mixins.Width(this, 100, this._imageElement);

		Mixins.Zoomable(this, () => URL.Card(this.image));

		Mixins.HoverEvents(this);
	}

	set(card) {
		this.id = (card.id != null) ? card.id : this.id;
		this.image = card.image || this.image;
		this.transform = card.transform || this.transform;
	}

	/** @param {KeyboardEvent} e */
	keyup(e) {
		if (!this.hovering)
			return;
		if (e.key == "f")
			this.flip();
	}

	keydown(e) {
		if (!this.hovering)
			return;
		if (e.key == "r") {
			this.rotation += Math.PI / 16;
			DB.Card.transform(this.id, this.transform);
		}
	}


	flip() {
		DB.Card.flip(this.id, async (res) => {
			this._imageElement.classList.add("flip");
			await sleep(100);
			this.set(res);
			this._imageElement.classList.remove("flip");
		});
	}

	take(position) {
		Hand.add(this, position);
		DB.Hand.add(this.id);
	}

	setZindex() {
		if (this.zIndex != null && this.zIndex == Card.ZIndexStack.length - 1)
			return;
		const index = Card.ZIndexStack.findIndex((val) => val.id == this.id);
		if (index != -1)
			Card.ZIndexStack.splice(index, 1);
		Card.ZIndexStack.push(this);
		Card.ZIndexStack.forEach((card, index) => {
			card.zIndex = index;
		});
	}

	get zIndex() {
		return parseInt(this.style.zIndex);
	}

	set zIndex(value) {
		this.style.zIndex = value;
	}

	/** @param {MouseEvent} e */
	mousedown(e) {
		if (e.button == 2)
			return;
		e.preventDefault();
		this.drag(e);
		this.setZindex();
	}

	/** @param {MouseEvent} e */
	mouseup(e) {
		const mouse = Mouse.fromEvent(e);
		if (this.grabbed()) {
			const inHand = Hand.contains(this);
			if (Hand.isHovering(mouse)) {
				if (!inHand) {
					this.take();
				} else {
					Hand.drop(this);
				}
			} else {
				if (inHand) {
					Hand.remove(this);
					DB.Hand.remove(this.id);
				}
				const hoverDeck = this.isOverOther(Deck.Instances, mouse);
				if (hoverDeck)
					DB.Deck.addCard(hoverDeck.id, this.id);
				const hoverCard = this.isOverOther(Card.Instances, mouse);
				if (hoverCard)
					DB.Deck.newDeck(hoverCard.id, this.id);
			}
			
		}
		this.drop(e);
	}

	isOverOther(instances, mouse) {
		for(const id in instances) {
			if (id == this.id)
				continue;
			const other = instances[id];
			if (other.clientRects.some((rect) => Rect.contains(rect, mouse)))
				return other;
		}
		return null;
	}

	/** @param {MouseEvent} e */
	mousemove(e) {
		if (!this.grabbed())
			return;
		e.preventDefault();

		DB.Card.transform(this.id, this.transform);
	}

	/** @param {MouseEvent} e */
	contextmenu(e) {
		e.preventDefault();
		Card.ContextMenu.open(e, this);
	}

	set image(value) { 
		this._image = value;
		this._imageElement.src = URL.Card(value);
	}

	get image() { return this._image; }

	get clientRects() {
		return [this._imageElement.getBoundingClientRect()];
	}
}

Card.HTML = `
<img />
`;

Card.CSS = `
img {
	${CSS.UserSelect("none")}
    transition: transform 100ms ease-in-out;
}
img.flip {
    transform: scaleX(0);
}
`;

/** @type {Object<number, Card>} */
Card.Instances = {};
Card.ZIndexStack = [];

/** @type {ContextMenu.<Card>} */
Card.ContextMenu = new ContextMenu();
Card.ContextMenu
	.button("Flip", (card) => card.flip())
	.button("Take", (card) => card.take())
	.idLabel()
;

customElements.define('card-element', Card);

Mixins.MouseEvents(Card.Instances);
Mixins.KeyboardEvents(Card.Instances);