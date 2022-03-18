const DraggableMixin = {
	drag(e) {
		this.setDrag(Mouse.fromEvent(e));
		if (this.width != null) this.width += 4;
	},
	setDrag(offset) {
		const pos = this.position;
		this.dragOffset = {
			x: pos.x - offset.x,
			y: pos.y - offset.y,
		};
	},
	drop(e) {
		if (!this.grabbed()) return;
		if (this.width != null) this.width -= 4;
		this.dragOffset = null;
	},
	grabbed() {
		return this.dragOffset != null;
	},
};

Mixins.Draggable = (object) => {
	Inject(object, "mousemove", (e) => {
		if (!object.grabbed()) return;
		const pos = object.position;
		pos.x = e.clientX + object.dragOffset.x;
		pos.y = e.clientY + object.dragOffset.y;
		object.position = pos;
	});
	Object.assign(object, DraggableMixin);
};
