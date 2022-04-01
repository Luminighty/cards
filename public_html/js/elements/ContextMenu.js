
 /** @template ContextType */
class ContextMenu extends HTMLElement {
	constructor() {
		super();
		const [wrapper, _] = Mixins.HTMLElement(
			this,
			ContextMenu.HTML,
			ContextMenu.CSS
		);
		wrapper.classList.add("context-menu");
		this.wrapper = wrapper;
		this.context = null;
		this.onShowCallbacks = [];
		this.items = [];

		document.body.appendChild(this);
		ContextMenu.Instances.push(this);
	}

	/**
	 * @param {string} label
	 * @param {ContextMenuItemCallback<ContextType>} onClick
	 * @param {ContextMenuItemArgs<ContextType>} args
	 * @returns {ContextMenu.<ContextType>}
	 */
	button(label, onClick, args = {}) {
		return this.item({ label, onClick, ...args });
	}

	/**
	 * @param {string} label
	 * @param {ContextMenuItemArgs<ContextType>} args
	 * @returns {ContextMenu.<ContextType>}
	 */
	label(label, args = {}) {
		return this.item({ label, ...args });
	}

	/**
	 * @param {ContextMenuItemCallback<ContextType>} getData
	 * @param {ContextMenuItemArgs<ContextType>} args
	 * @returns {ContextMenu.<ContextType>}
	 */
	dataLabel(getData, args = {}) {
		return this.item({ onShow: getData, ...args });
	}

	/**
	 * @param {ContextMenuItemCallback<ContextType>} onClick
	 * @param {ContextMenuItemCallback<ContextType>} onShow
	 * @param {ContextMenuItemArgs<ContextType>} args
	 * @returns {ContextMenu.<ContextType>}
	 */
	checkbox(label, onClick, onShow, args = {}) {
		return this.item({
			html: `<input type="checkbox"><span>${label}</span>`,
			onClick,
			onShow: (context, item, e) => {
				const [checked, label] = onShow(context, item, e);
				if (label)
					item.querySelector("span").innerText = label;
				item.querySelector("input").checked = checked;
			},
			...args,
		});
	}

	/**
	 * @param {ContextMenuItemArgs<ContextType>} args
	 * @returns {ContextMenu.<ContextType>}
	 */
	idLabel(args = {}) {
		return this.dataLabel((context, item) => {
			item.innerText = `Id: ${context["id"] || 0}`;
		}, ContextMenuStyles.Label({ fontSize: "10px", textAlign: "right", padding: "0px 10px", ...args }));
	}
	/**
	 * 
	 * @param {string} label 
	 * @param {ContextSubMenuCallback<ContextType>} callback 
	 * @param {ContextMenuItemArgs<ContextType>} args 
	 */
	subMenu(label, callback, args = {}) {
		const menu = new ContextMenu();
		callback(menu);
		const OpenMenu = (context, item, e) => {
			const rect = item.getBoundingClientRect();
			const position = {
				x: rect.right,
				y: rect.top,
			};
			menu.openAt(position, context, e);
		};
		return this.item({
			label,
			onHover: OpenMenu, 
			onClick: OpenMenu,
			onHoverStop: () => menu.close(),
			attributes: ["keepOpenAfterClick"],
			...args
		});
	}

	/**
	 * @param {ContextMenuItemArgs<ContextType>} data
	 * @returns {ContextMenu.<ContextType>}
	 */
	item(data) {
		const item = this.wrapper.appendChild(document.createElement("div"));
		item.innerHTML = data.html || data.label || "";
		item.classList.add("item");
		if (data.attributes)
		data.attributes.forEach((value) => data[value] = true);
		ContextMenu.Args.Class.filter((val) => data[val]).forEach((val) =>
			item.classList.add(val)
		);

		ContextMenu.Args.Style.filter((val) => data[val]).forEach(
			(val) => (item.style[val] = data[val])
		);

		item.style.color = data.color || "";
		item.style.backgroundColor = data.backgroundColor || "";
		if (data.onClick) {
			item.addEventListener("click", (e) => {
				data.onClick(this.context, item, e);
				if (!data.keepOpenAfterClick) this.close();
			});
			item.classList.add("button");
		}
		if (data.onShow) this.onShowCallbacks.push([item, data.onShow]);
		item.addEventListener("mouseenter", (e) => {
			this.items.forEach(([other, data]) => {
				if (data.onHoverStop && item != other)
				data.onHoverStop(this.context, other, e);
			});
			if (data.onHover)
				data.onHover(this.context, item, e);
		});

		this.items.push([item, data]);

		return this;
	}

	get isOpen() {
		return this.wrapper.classList.contains("visible");
	}


	/**
	 * @param {Vector2} pos
	 * @param {ContextType} context 
	 * @param {MouseEvent=} e
	 */
	openAt(pos, context, e) {
		if (this.isOpen)
			return;
		for (const [item, cb] of this.onShowCallbacks) cb(context, item, e);
		const { x, y } = pos;
		this.wrapper.style.left = `${x}px`;
		this.wrapper.style.top = `${y}px`;
		this.wrapper.classList.add("visible");
		this.context = context;
	}

	/**
	 * @param {MouseEvent} e 
	 * @param {ContextType} context 
	 */
	open(e, context) {
		if (Camera._moved)
			return;
		const { clientX: x, clientY: y } = e;
		this.openAt({x, y}, context, e);
	}

	close() {
		this.wrapper.classList.remove("visible");
	}

	getBoundingClientRect() {
		return this.wrapper.getBoundingClientRect();
	}
}

ContextMenu.Args = {};
/** @type {ContextMenuAttribute[]} */
ContextMenu.Args.Class = ["bold", "italic", "strikethrough", "underline", "button"];
ContextMenu.Args.Style = ["color", "backgroundColor", "opacity", "fontSize", "padding", "textAlign"];

const ContextMenuStyles = {};
ContextMenuStyles.Label = (args) => ({italic: true, opacity: "0.5", ...args});

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
	${CSSStyles.UserSelect("none")}
}

.context-menu.visible {
	transform: scale(1);
	transition: transform 75ms ease-in-out;
}
.item input[type="checkbox"] {
    appearance: none;
    border: 2px solid #ffffff;
    border-radius: 3px;
    margin: auto 5px auto 0px;
    padding: 6px;
    pointer-events: none;
    vertical-align: text-top;
}
.item input:checked {
	background-image: url(media/check.png);
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

window.addEventListener("load", () => {
	window.addEventListener("mousedown", (e) => {
		for (const context of ContextMenu.Instances) {
			if (!context.isOpen)
				continue;
			const rect = context.getBoundingClientRect();
			const position = Mouse.screen;
			if (!Rect.contains(rect, position))
				context.close();
		}
	});
});