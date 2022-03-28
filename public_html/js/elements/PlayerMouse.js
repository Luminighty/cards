class PlayerMouse extends HTMLElement {
	constructor() {
		super();
		const [wrapper, _] = Mixins.HTMLElement(this, PlayerMouse.HTML, PlayerMouse.CSS);
		
		this.span = /** @type {HTMLSpanElement} */ (wrapper.firstElementChild);

		Mixins.Transform(this);
		Mixins.Transition.Transform(this);
	}

	set(data) {
		this.id = data.id;
		this.name = data.name || this.name;
		//if (data.color)
		//	this.color = data.color;

		if (data.mouse) {
			this.position = data.mouse.position;
			this.rotation = data.mouse.rotation;
		}
		this.span.style.backgroundImage = `url("avatar/${this.id}")`;
	}


	set color(color) {
		this._color = color;
		this.span.style.filter = `hue-rotate(${color}deg) brightness(20)`;
	}

	get color() {
		return this._color;
	}
}

/** @type {Object<string, PlayerMouse>} */
PlayerMouse.Instances = {};
PlayerMouse.HTML = `<span></span>`;

PlayerMouse.CSS = `
span {
	position: absolute;
    background-repeat: round;
    border-radius: 1000px;
    width: 32px;
    height: 32px;
	z-index: 999999;
	transition: transform 500ms ease-in-out;
    transform: translate(-5px, -5px);
}
`;

customElements.define('player-mouse', PlayerMouse);

