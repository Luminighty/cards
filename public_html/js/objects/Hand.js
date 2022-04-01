const Hand = {
	add(card, position) {
		//card.style.position = "fixed";
		this.items.splice(position || this.findPositionIndex(card), 0, card);
		this.sortItems();
		this.element.appendChild(card);
		card.rotation = 0;
	},

	/**
	 * @param {Card} card 
	 * @param {boolean} withoutSort 
	 * @returns 
	 */
	remove(card, withoutSort = false) {
		//card.style.position = "absolute";
		const index = this.items.findIndex((value) => value.id == card.id);
		const removed = this.items.splice(index, 1);
		if (!withoutSort) {
			this.sortItems();
			const pos = card.position;
			const offset = this.position;
			const rect = card.getBoundingClientRect();

			const res = Camera.screenToGame({
				x: pos.x + offset.x + rect.width / 2,
				y: pos.y + offset.y + rect.height / 2,
			});

			
			card.position = {
				x: res.x - rect.width / 2,
				y: res.y - rect.height / 2,
			};

			ElementContainer.appendChild(card);

			card.rotation = -Camera.rotation;
		}
		return removed;
	},

	contains(card) {
		return this.items.findIndex((value) => value.id == card.id) != -1;
	},

	drop(card) {
		this.remove(card, true);
		this.items.splice(this.findPositionIndex(card), 0, card);
		//card.style.position = "fixed";
		this.sortItems();
	},

	findPositionIndex(card) {
		for(let i = 0; i < this.items.length; i++) {
			const x = this.items[i].position.x;
			const cardPos = card.position;
			if (cardPos.x > x)
				continue;
			return i;
		}
		return this.items.length;
	},


	set height(value) {
		this.element.style.height = `${value}px`;
	},

	get height() {
		return parseInt(this.element.style.height) || 0;
	},

	set width(value) {
		this.element.style.width = `${value}px`;
	},

	get width() {
		return parseInt(this.element.style.width) || 0;
	},
	isHovering(mouse) {
		return Rect.contains(this.element.getBoundingClientRect(), mouse);
	},

	sortItems() {
		const requiredWidth = this.items.map((item) => item.width + this.padding).reduce((a, b) => a+b, 0);
		const maxWidth = this.width;
		const rect = this.element.getBoundingClientRect();

		let offset = 0;
		let delta = (card) => card.width + this.padding;
		if (requiredWidth < maxWidth) {
			offset = (maxWidth - requiredWidth) / 2;
		} else {
			delta = (card) => (maxWidth - card.width) / (this.items.length-1);
		}
		//offset += rect.left;

		for (const item of this.items) {
			item.position = {
				x: offset,
				y: 0,
			};
			offset += delta(item);
		}
	},

	padding: 10,

	element: document.body.appendChild(document.createElement("div")),
	items: [],
	get position() {
		const rect = this.element.getBoundingClientRect();
		return {x: rect.x, y: rect.y};
	}
};

Hand.element.id = "Hand";
//Hand.element.style.zIndex = "-100";

function setHandDimensions() {
	Hand.width = document.body.clientWidth * 2 / 3;
	Hand.height = 100;
	Hand.sortItems();
}
window.addEventListener("load", () => {
	window.addEventListener("resize", setHandDimensions);
	setHandDimensions();
});