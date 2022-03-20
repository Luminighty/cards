class PlayerMouse extends HTMLElement {
	constructor() {
		super();
		const [wrapper, _] = Mixins.HTMLElement(this, PlayerMouse.HTML, PlayerMouse.CSS);
		/** @type {HTMLSpanElement} */
		this.span = wrapper.firstElementChild;

		Mixins.Position(this);
	}

	set(data) {
		this.id = data.id;
		this.position = data.mouse || this.mouse;
		this.name = data.name || this.name;
		if (data.color)
			this.color = data.color;
	}

	set color(color) {
		this._color = color;
		this.span.style.filter = `hue-rotate(${color}deg)`;
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
}
`;

customElements.define('player-mouse', PlayerMouse);

