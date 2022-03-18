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
		if (e.key == "f" && this.hovering)
			this.flip();
		
	}

	flip() {
		DB.Card.flip(this.id, (res) => {
			this.set(res);
		});
	}

	take(position) {
		Hand.add(this, position);
		DB.Hand.add(this.id);
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

		DB.Card.move(this.id, this.position);
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
}
`;

/** @type {Object<number, Card>} */
Card.Instances = {};

Card.ContextMenu = new ContextMenu()
	.button("Flip", (context) => context.flip())
	.button("Take", (context) => context.take())
	.button("Cute dimi", (context, e) => console.log("fake"))
	.button("Stupid lumi", (context, e) => console.log("yeah"))
;

customElements.define('card-element', Card);

Mixins.MouseEvents(Card.Instances);
Mixins.KeyboardEvents(Card.Instances);