const Hand = {
	add(card, position) {
		//card.style.position = "fixed";
		card.inHand = true;
		this.items.splice(position || this.findPositionIndex(card), 0, card);
		this.sortItems();
		this.element.appendChild(card);
	},

	remove(card, withoutSort = false) {
		//card.style.position = "absolute";
		const index = this.items.findIndex((value) => value.id == card.id);
		const removed = this.items.splice(index, 1);
		if (!withoutSort) {
			this.sortItems();
			card.inHand = false;
			ElementContainer.appendChild(card);
			//screen.x -= card.dragOffset.x || 0;
			//screen.y -= card.dragOffset.y || 0;
			const pos = card.position;
			const rect = this.element.getBoundingClientRect();
			pos.x += rect.x - Camera.position.x;
			pos.y += rect.y - Camera.position.y;
			card.position = pos; //Camera.apply(pos); //Camera.screenToGame(pos);
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
};

Hand.element.id = "Hand";
//Hand.element.style.zIndex = "-100";

function setHandDimensions() {
	Hand.width = document.body.clientWidth / 2;
	Hand.height = 100;
	Hand.sortItems();
}

window.addEventListener("resize", setHandDimensions);
setHandDimensions();