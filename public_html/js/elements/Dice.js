class Dice extends HTMLElement {
	constructor() {
		super();
		const [wrapper, _] = Mixins.HTMLElement(this, Dice.HTML, Dice.CSS);

		this.container = /** @type {HTMLDivElement} */ (wrapper.firstElementChild);
		this.dice = /** @type {HTMLDivElement} */ (this.container.firstElementChild);
		this._locked = false;

		Mixins.Transform(this);
		Mixins.Draggable(this);
		Mixins.HoverEvents(this);

		Mixins.Transition.Transform(this);
		
		Mixins.ZIndexStacked(this);
		this._side = {index: 0};
	}

	lock() {
		this._locked = !this._locked;
		DB.Dice.lock(this.id, this._locked);
	}

	get locked() {
		return this._locked;
	}

	set locked(value) {
		this._locked = value;
	}

	set(dice) {
		this.id = (dice.id != null) ? dice.id : this.id;
		this.transform = dice.transform || this.transform;
		if (dice.image)
			this.image = dice.image;
		if (dice.side)
			this.side = dice.side;
		if (dice.locked != null)
			this.locked = dice.locked;
	}

	/** @param {{index: number, x?: number, y?: number}} value */
	set side(value) {
		const delta = (this._side.x != null && this._side.y != null) ? Position.delta(value, this._side) : 0;
		value.x = value.x || this._side.x || 0;
		value.y = value.y || this._side.y || 0;
		
		const rotation = this.image[value.index].rotation || {x: 0, y: 0};
		const x = rotation.x + value.x * Math.PI * 2;
		const y = rotation.y + value.y * Math.PI * 2;
		
		this.dice.style.transition = `transform ${(delta+1) * 200}ms`;
		this.dice.style.transform = `rotateX(${-x}rad) rotateY(${-y}rad)`;

		this._side = value;
	}

	get side() {
		return this._side;
	}


	/** @param {KeyboardEvent} e */
	keyup(e) {
		if (!this.hovering)
			return;
		if (e.key == "r") 
			this.roll();
		if (this.sideKeys.includes(e.key)) {
			const index = parseInt(e.key) - 1;
			this.side = {index};
			DB.Dice.set(this.id, index);
		}
	}

	get sideKeys() {
		return [...Array(this.image.length)].map((_, i) => `${i+1}`);
	}

	roll() {
		DB.Dice.roll(this.id, (data) => {
			this.set(data);
		});
	}

	/** @param {MouseEvent} e */
	contextmenu(e) {
		e.preventDefault();
		if (this.grabbed()) return;
		Dice.ContextMenu.open(e, this);
	}

	mousedown(e) {
		if (e.button != 0)
			return;
		e.preventDefault();
		this.drag(e);
		this.setZIndex();
	}

	mousemove(e) {
		if (!this.grabbed()) return;
		DB.Dice.transform(this.id, this.transform);
	}

	/** @param {MouseEvent} e */
	mouseup(e) {
		if (e.button != 0) return;
		this.drop(e);
	}
	/** @param {DiceSideData[]} value */
	set image(value) {
		this._image = value;
		while(this.dice.childElementCount > 0)
			this.dice.removeChild(this.dice.firstElementChild);
		value.forEach((side) => {
			const img = this.dice.appendChild(document.createElement("img"));
			img.classList.add("side");
			img.src = Resource.Dice(side.image);
			img.width = side.size;
			img.style.transform = side.transform;
			this.container.style.width = `${side.size}px`;
			this.container.style.height = `${side.size}px`;
		});
	}

	get image() {
		return this._image;
	}

}
Dice.HTML = `
	<div id="container">
		<div id="dice">
		</div>
	</div>
`;

Dice.CSS = `
.side {
	position: absolute;
	opacity: 1;
}
#container {
	perspective: 1000px;
	perspective-origin: 50% 100%;
	width: 100px;
	height: 100px;
	position: relative;
}
#dice {
	transform-style: preserve-3d;
	width: 100%;
	height: 100%;
	position: absolute;
    transition-timing-function: cubic-bezier(0, 0, 1, 1.3);
    transition-property: transform;
}
`;
/** @type {Object<string, Dice>} */
Dice.Instances = {};
customElements.define('dice-element', Dice);
Mixins.MouseEvents(Dice.Instances);
Mixins.KeyboardEvents(Dice.Instances);


/** @type {ContextMenu.<Dice>} */
Dice.ContextMenu = new ContextMenu();
Dice.ContextMenu
	.button("Roll", (dice) => dice.roll())
	.checkbox("Lock", (dice) => dice.lock(), (dice) => [dice.locked])
	.idLabel();