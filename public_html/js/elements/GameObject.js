class GameObject extends HTMLElement {
	constructor() {
		super();

		const [wrapper, _] = Mixins.HTMLElement(this, GameObject.HTML, GameObject.CSS);
	
		this._imageElement = /** @type {HTMLImageElement} */ (wrapper.firstElementChild);

		Mixins.Draggable(this);
		Mixins.Transform(this);
		Mixins.Zoomable(this, () => Resource.Card(this.image));
		Mixins.Width(this, 100, this._imageElement);
		Mixins.HoverEvents(this);
		Mixins.Transition.Transform(this);
		Mixins.ZIndexStacked(this);
	}

	set(object) {
		this.id = object.id || this.id;
		this.transform = object.transform || this.transform;
		this.image = object.image || this.image;
		this.width = object.width || this.width;
	}

	mouseup(e) {
		this.drop(e);
	}

	mousedown(e) {
		if (e.button != 0)
			return;
		e.preventDefault();
		this.drag(e);
		this.setZIndex();
	}

	keydown(e) {
		if (!this.hovering)
			return;
		e.preventDefault();
		if (e.key == "r") {
			this.rotate(GetRotate(e.ctrlKey));
		}
	}

	mousemove(e) {
		e.preventDefault();

		if (!this.grabbed())
			return;
		DB.GameObject.transform(this.id, this.transform);
	}

	/** @param {WheelEvent} e */
	wheel(e) {
		this.rotate(GetRotate(e.deltaY < 0));
	}

	rotate(amount) {
		this.rotation += amount;
		DB.GameObject.transform(this.id, this.transform);
	}


	get image() { return this._image; }

	set image(value) {
		this._image = value;
		this._imageElement.src = Resource.Object(value);
	}
	
	get clientRects() {
		return [this._imageElement.getBoundingClientRect()];
	}
}


GameObject.HTML = `
<img />
`;
GameObject.CSS = `
img {
	${CSSStyles.UserSelect("none")}
}`;

/** @type {Object<string, GameObject>} */
GameObject.Instances = {};

customElements.define('game-object', GameObject);
Mixins.MouseEvents(GameObject.Instances);
Mixins.KeyboardEvents(GameObject.Instances);