
Mixins.Zoomable = (object, src) => {
	Inject(object, "keydown", (e) => {
		if (e.key == "Tab") {
			e.preventDefault();
			if (object.hovering) {
				ZoomedImage.set(src(), object.id);
			} else if (ZoomedImage.elementId == object.id) {
				ZoomedImage.clear();
			}
		}
	});
	Inject(object, "keyup", (e) => {
		if (e.key == "Tab")
			ZoomedImage.clear();
	});
};


const ZoomedImage = {
	set(src, id) {
		this.element.src = src;
		this.element.style.display = "block";

		const size = {
			height: window.innerHeight,
			width: window.innerWidth,
		};

		const horiz = (Mouse.x < size.width / 2) ? "right" : "left";
		const vert = (Mouse.y < size.height / 2) ? "bottom" : "top";

		this.element.style.left = null;
		this.element.style.right = null;
		this.element.style.top = null;
		this.element.style.bottom = null;

		this.element.style[horiz] = `0px`;
		this.element.style[vert] = `0px`;
		this.elementId = id;
	},
	clear() {
		this.element.src = "";
		this.element.style.display = "none";
		this.elementId = null;
	},
	elementId: null,
	/** @type {HTMLImageElement} */
	// @ts-ignore
	element: document.getElementById("zoomed-image")
};