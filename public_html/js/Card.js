class Card extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		const wrapper = document.createElement('span');
		wrapper.innerHTML = Card.HTML;
		/**
		 * @type {HTMLImageElement}
		 */
		this._imageElement = wrapper.firstElementChild;
		const style = document.createElement('style');
		style.textContent = Card.CSS;

		//this.style.position = "absolute";

		this.addEventListener("mouseenter", () => {this.hovering = true});
		this.addEventListener("mouseleave", () => {this.hovering = false});
		this.addEventListener("mousedown", this.mousedown);
		window.addEventListener("keypress", this.keypress.bind(this));
		window.addEventListener("mouseup", this.mouseup.bind(this));
		window.addEventListener("mousemove", this.mousemove.bind(this));

		this.shadowRoot.append(style, wrapper);
	}

	set(card) {
		this.id = card.id || this.id;
		this.image = card.image || this.image;
		this.position = card.position || this.position;
	}

	/** @param {KeyboardEvent} e */
	keypress(e) {
		if (e.key == "f" && this.hovering) {
			DB.Card.flip(this.id, (res) => {
				this.set(res);
			});
		}
	}

	/** @param {MouseEvent} e */
	mousedown(e) {
		e.preventDefault();
		const pos = this.position;
		this.dragOffset = {
			x: pos.x - e.clientX,
			y: pos.y - e.clientY,
		};
		if (parseInt(this.style.zIndex) != Object.keys(Card.Instances).length) {
			for (const key in Card.Instances) {
				const card = Card.Instances[key];
				card.style.zIndex = parseInt(card.style.zIndex || 0) - 1;
			}
			this.style.zIndex = Object.keys(Card.Instances).length;
		}
	}

	/** @param {MouseEvent} e */
	mouseup(e) {
		this.dragOffset = null;
	}

	/** @param {MouseEvent} e */
	mousemove(e) {
		if (!this.dragOffset)
			return;
		e.preventDefault();

		const pos = this.position;
		pos.x = e.clientX + this.dragOffset.x;
		pos.y = e.clientY + this.dragOffset.y;
		this.position = pos;
		DB.Card.move(this.id, pos);
	}

	set position(value) {
		this.style.left = `${value.x}px`;
		this.style.top = `${value.y}px`;
	}

	get position() {
		return {
			x: parseInt(this.style.left) || 0,
			y: parseInt(this.style.top) || 0,
		};
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
	width: 100px;
	${CSS.UserSelect("none")}
}
`;

Card.Instances = {};

customElements.define('card-element', Card);