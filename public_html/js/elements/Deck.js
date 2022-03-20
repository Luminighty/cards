class Deck extends HTMLElement {
	constructor() {
		super();
		const [wrapper, style] = Mixins.HTMLElement(this, Deck.HTML, Deck.CSS);

		/** @type {HTMLImageElement[]} */
		this._imageElements = Array.from(wrapper.querySelectorAll("img"));

		this._imageElements.forEach((img) => img.addEventListener("load", this.onImageload.bind(this)));

		Mixins.Transform(this);
		Mixins.Draggable(this);
		Mixins.Width(this, 100, ...this._imageElements);

		Mixins.Zoomable(this, () => URL.Card(this.image[0]));

		Mixins.HoverEvents(this);
	}

	set(deck) {
		this.id = deck.id || this.id;
		this.transform = deck.transform || this.transform;
		this.cardCount = deck.cardCount || this.cardCount;
		if (deck.image)
			this.image = deck.image;
		if (deck.shuffle)
			ShuffleImages(...this._imageElements);
	}

	/** @param {KeyboardEvent} e */
	keyup(e) {
		if (e.key == "s" && this.hovering)
			this.shuffle();
	}
	/** @param {KeyboardEvent} e */
	keydown(e) {
		if (!this.hovering)
			return;
		if (e.key == "r") {
			this.rotation += Math.PI / 16;
			DB.Deck.transform(this.id, this.transform.data)
		}
	}
	
	shuffle() {
		DB.Deck.shuffle(this.id);
		ShuffleImages(...this._imageElements);
	}

	draw() {
		//this.dragStart = this.dragStart || Mouse.position;
		
		DB.Deck.draw(this.id, null, (card, deck, _) => {
			const element = createCard(card);
			element.take(Hand.items.length);
			//element.setDrag(drag);
			element.setZindex();
			this.set(deck);
		});
	}


	/** @param {MouseEvent} e */
	mousedown(e) {
		if (e.button == 2)
			return;
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
		DB.Deck.transform(this.id, this.transform);
	}

	/** @param {MouseEvent} e */
	contextmenu(e) {
		e.preventDefault();
		Deck.ContextMenu.open(e, this);
	}

	set image(value) {
		this._image = value;
		this._imageElements.forEach((img, index) => {
			img.src =  URL.Card(value[index] || "");
			img.style.zIndex = index - value.length;
			img.style.left = `${(index) * 10}px`;
			img.style.display = value[index] ? "initial" : "none";
		});
	}

	onImageload() {
		const width = this.width + (this.image.length-1) * 10;
		this.style.width = `${width}px`;
		this.style.height = `${this._imageElements[0].height}px`;
	}

	get image() {
		return this._image;
	}

	get clientRects() {
		return this._imageElements.map((element) => element.getBoundingClientRect());
	}
}

Deck.HTML = `
<img />
<img />
<img />
`;

Deck.CSS = `
img {
    position: absolute;
	width: 100px;
	${CSS.UserSelect("none")}
	transition: transform 200ms ease-in-out
}
.flip {
	transform: rotate(180deg);
}
.reverseFlip {
	transform: rotate(-180deg);
}
`;

/** @param {HTMLElement[]} images */
async function ShuffleImages(...images) {
	const randomFlip = (image, index) => index % 2 ? image.classList.add("flip") : image.classList.add("reverseFlip");
	images.forEach(randomFlip);
	await sleep(300);
	images.forEach((img) => img.classList.remove("flip", "reverseFlip"));
}


/** @type {Object<number, Deck>} */
Deck.Instances = {};

/** @type {ContextMenu.<Deck>} */
Deck.ContextMenu = new ContextMenu();
Deck.ContextMenu
	.button("Draw", (deck) => deck.draw())
	.button("Shuffle", (deck) => deck.shuffle())
	.dataLabel((item, deck) => item.innerText = `Size: ${deck.cardCount || 0}`, ContextMenuStyles.Label())
	.idLabel()
;

customElements.define('deck-element', Deck);

Mixins.MouseEvents(Deck.Instances);
Mixins.KeyboardEvents(Deck.Instances);
