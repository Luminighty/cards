class ContextMenu extends HTMLElement {
	constructor() {
		super();
		const [wrapper, _] = Mixins.HTMLElement(this, ContextMenu.HTML, ContextMenu.CSS);
		wrapper.classList.add("context-menu");
		this.wrapper = wrapper;
		this.context = null;

		document.body.appendChild(this);
		ContextMenu.Instances.push(this);
	}

	button(label, onClick, ...args) {
		return this.item({label, onClick, ...args});
	}

	/** @param {ContextMenuItemArgs} data */
	item(data) {
		const item = this.wrapper.appendChild(document.createElement("div"));
		item.innerText = data.label || "";
		item.classList.add("item");
		if (data.onClick) {
			item.addEventListener("click", (e) => {
				data.onClick(this.context, e);
				if (!data.keepOpenAfterClick)
					this.close();
			});
			item.classList.add("button");
		}
		return this;
	}

	get isOpen() {
		return this.wrapper.classList.contains("visible");
	}

	open(e, context) {
		const {clientX: x, clientY: y} = e;
		this.wrapper.style.left = `${x}px`;
		this.wrapper.style.top = `${y}px`;
		this.wrapper.classList.add("visible");
		this.context = context;
	}

	close() {
		this.wrapper.classList.remove("visible");
	}

	getBoundingClientRect() {
		return this.wrapper.getBoundingClientRect();
	}

}

/**
 * @typedef {Object} ContextMenuItemArgs
 * @property {(context, MouseEvent) => void=} onClick
 * @property {string} label
 * @property {bool} keepOpenAfterClick
 */

ContextMenu.HTML = ``;


ContextMenu.CSS = `
.context-menu {
	position: fixed;
	z-index: 100000;
	width: 150px;
	background: #1b1a1a;
	border-radius: 5px;
	transform-origin: top left;
	transform: scale(0);
}

.context-menu.visible {
	transform: scale(1);
	transition: transform 150ms ease-in-out;
}

.context-menu .item {
	padding: 8px 10px;
	font-size: 15px;
	color: #eee;
	cursor: pointer;
	border-radius: inherit;

}

.context-menu .button:hover {
	background: #343434;
}
`;

/** @type {ContextMenu[]} */
ContextMenu.Instances = [];

customElements.define('context-menu', ContextMenu);

window.addEventListener("mouseup", (e) => {
	for (const context of ContextMenu.Instances) {
		if (!context.isOpen)
			continue;
		const rect = context.getBoundingClientRect();
		const position = Mouse.fromEvent(e);
		if (!Rect.contains(rect, position))
			context.close();
	}
});