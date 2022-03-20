
 /** @template ContextType */
class ContextMenu extends HTMLElement {
	constructor() {
		super();
		const [wrapper, _] = Mixins.HTMLElement(this, ContextMenu.HTML, ContextMenu.CSS);
		wrapper.classList.add("context-menu");
		this.wrapper = wrapper;
		this.context = null;
		this.onShowCallbacks = [];


		document.body.appendChild(this);
		ContextMenu.Instances.push(this);
	}

	/**
	 * @param {string} label 
	 * @param {ContextMenuCallback<ContextType>} onClick 
	 * @param {ContextMenuItemArgs<ContextType>} args 
	 * @returns {ContextMenu.<ContextType>}
	 */
	button(label, onClick, ...args) {
		return this.item({label, onClick, ...args});
	}

	/**
	 * @param {string} label 
	 * @param {ContextMenuItemArgs<ContextType>} args 
	 * @returns {ContextMenu.<ContextType>}
	 */
	label(label, args) {
		return this.item({label, ...args});
	}

	/**
	 * @param {ContextMenuItemCallback<ContextType>} getData 
	 * @param {ContextMenuItemArgs<ContextType>} args 
	 * @returns {ContextMenu.<ContextType>}
	 */
	dataLabel(getData, args) {
		return this.item({onShow: getData, ...args});
	}

	/**
	 * @param {ContextMenuItemArgs<ContextType>} args 
	 * @returns {ContextMenu.<ContextType>}
	 */
	idLabel(args) {
		return this.dataLabel((item, context) => {
			item.innerText = `Id: ${context.id}`;
		}, ContextMenuStyles.Label({fontSize: "10px", textAlign: "right", padding: "0px 10px"}));
	}

	/** 
	 * @param {ContextMenuItemArgs<ContextType>} data 
	 * @returns {ContextMenu.<ContextType>}
	 */
	item(data) {
		const item = this.wrapper.appendChild(document.createElement("div"));
		item.innerText = data.label || "";
		item.classList.add("item");

		ContextMenu.Args.Class
			.filter((val) => data[val])
			.forEach((val) => item.classList.add(val));

			
		ContextMenu.Args.Style
			.filter((val) => data[val])
			.forEach((val) => item.style[val] = data[val]);

		item.style.color = data.color || "";
		item.style.backgroundColor = data.backgroundColor || "";
		if (data.onClick) {
			item.addEventListener("click", (e) => {
				data.onClick(this.context, e);
				if (!data.keepOpenAfterClick)
					this.close();
			});
			item.classList.add("button");
		}
		if (data.onShow)
			this.onShowCallbacks.push([item, data.onShow]);

		return this;
	}

	get isOpen() {
		return this.wrapper.classList.contains("visible");
	}

	open(e, context) {
		for (const [item, cb] of this.onShowCallbacks)
			cb(item, context, e);
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

ContextMenu.Args = {};
ContextMenu.Args.Class = ["bold", "italic", "strikethrough", "underline"];
ContextMenu.Args.Style = ["color", "backgroundColor", "opacity", "fontSize", "padding", "textAlign"];

ContextMenuStyles = {};
ContextMenuStyles.Label = (args) => ({italic: true, opacity: "0.5", ...args});

/**
 * @template T
 * @typedef {Object} ContextMenuItemArgs<T>
 * @property {string} label
 * @property {bool} keepOpenAfterClick
 * @property {bool} bold
 * @property {bool} italic
 * @property {bool} strikethrough
 * @property {bool} underline
 * @property {string=} textAlign
 * @property {string=} color
 * @property {string=} backgroundColor
 * @property {string=} opacity
 * @property {string=} fontSize
 * @property {string=} padding
 * @property {ContextMenuItemCallback<T>=} onShow
 * @property {ContextMenuItemCallback<T>=} onHover
 * @property {ContextMenuCallback<T>=} onClick
 */

/**
 * @template T
 * @callback ContextMenuItemCallback<T>
 * @param {HTMLDivElement} item
 * @param {T} context
 * @param {MouseEvent} e
 */
/**
 * @template T
 * @callback ContextMenuCallback<T>
 * @param {T} context
 * @param {MouseEvent} e
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
.context-menu * {
	${CSS.UserSelect("none")}
}

.context-menu.visible {
	transform: scale(1);
	transition: transform 150ms ease-in-out;
}

.context-menu .item {
	padding: 8px 10px;
	font-size: 15px;
	color: #eee;
	border-radius: inherit;
}
.bold {
	font-weight: 700;
}
.italic {
	font-style: italic;
}
.strikethrough {
    text-decoration: line-through;
}
.underline {
    text-decoration: underline;
}
.context-menu .button:hover {
	background: #343434;
}
.context-menu .button {
	cursor: pointer;
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