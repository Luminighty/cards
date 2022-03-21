class PlayerMouse extends HTMLElement {
	constructor() {
		super();
		const [wrapper, _] = Mixins.HTMLElement(this, PlayerMouse.HTML, PlayerMouse.CSS);
		/** @type {HTMLSpanElement} */
		this.span = wrapper.firstElementChild;

		Mixins.Transform(this);
		Mixins.Transition.Transform(this);
	}

	set(data) {
		this.id = data.id;
		this.position = data.mouse || this.position;
		this.name = data.name || this.name;
		if (data.color)
			this.color = data.color;
	}

	set color(color) {
		this._color = color;
		this.span.style.filter = `hue-rotate(${color}deg) brightness(20)`;
	}

	get color() {
		return this._color;
	}
}

/** @type {Object<number, PlayerMouse>} */
PlayerMouse.Instances = {};
PlayerMouse.HTML = `<span></span>`;

PlayerMouse.CSS = `
span {
	position: absolute;
    background: url("img/cursor.png");
	width: 20px;
	height: 20px;
    overflow: hidden;
    background-repeat: no-repeat;
	z-index: 999999;
	transition: transform 500ms ease-in-out;
}
`;

customElements.define('player-mouse', PlayerMouse);

