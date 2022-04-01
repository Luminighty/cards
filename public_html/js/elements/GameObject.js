class GameObject extends HTMLElement {
	constructor() {
		super();

		const [wrapper, _] = Mixins.HTMLElement(this, GameObject.HTML, GameObject.CSS);
	
		this._imageElement = /** @type {HTMLImageElement} */ (wrapper.firstElementChild);
		this._locked = false;

		Mixins.Draggable(this);
		Mixins.Transform(this);
		Mixins.Zoomable(this, () => Resource.Card(this.image));
		Mixins.Width(this, 100, this._imageElement);
		Mixins.HoverEvents(this);
		Mixins.Transition.Transform(this);
		Mixins.ZIndexStacked(this);
	}

	set(object) {
		this.id = (object.id != null) ? object.id : this.id;
		this.transform = object.transform || this.transform;
		this.image = object.image || this.image;
		this.width = object.width || this.width;
		if (object.locked != null)
			this._locked = object.locked;
	}

	lock() {
		this._locked = !this._locked;
		DB.GameObject.lock(this.id, this._locked);
	}

	get locked() { return this._locked; }

	mouseup(e) {
		this.drop(e);
	}

	/** @param {MouseEvent} e */
	contextmenu(e) {
		e.preventDefault();
		if (this.grabbed()) return;
		GameObject.ContextMenu.open(e, this);
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
		if (Input.Rotate(e))
			this.rotate(GetRotate(Input.ReverseRotate(e)));
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

/** @type {ContextMenu.<GameObject>} */
GameObject.ContextMenu = new ContextMenu();
GameObject.ContextMenu
	.checkbox("Lock", (object) => object.lock(), (object) => [object.locked])
	.idLabel();

customElements.define('game-object', GameObject);
Mixins.MouseEvents(GameObject.Instances);
Mixins.KeyboardEvents(GameObject.Instances);