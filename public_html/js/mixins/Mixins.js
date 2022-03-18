const Mixins = {};

function Inject(object, func, callback) {
	const old = object[func].bind(object);
	const cb = callback.bind(object);
	object[func] = (...args) => {
		cb(...args);
		old(...args);
	};
}

/** @returns {[HTMLSpanElement, HTMLStyleElement]} wrapper, style */
Mixins.HTMLElement = (object, html, css) => {
	object.attachShadow({ mode: "open" });

	const wrapper = document.createElement("span");
	wrapper.innerHTML = html;
	const style = document.createElement("style");
	style.textContent = css;

	object.shadowRoot.append(style, wrapper);

	return [wrapper, style];
};

Mixins.Position = (object) => {
	Object.defineProperty(object, "position", {
		get() {
			return {
				x: parseInt(object.style.left) || 0,
				y: parseInt(object.style.top) || 0,
			};
		},
		set(value) {
			object.style.left = `${value.x}px`;
			object.style.top = `${value.y}px`;
		},
	});
};

Mixins.Width = (object, width, ...elements) => {
	Object.defineProperty(object, "width", {
		get() {
			return parseInt(elements[0].style.width) || 0;
		},
		set(value) {
			for (const element of elements)
				element.style.width = `${value}px`;
		},
	});
	object.width = width;
};