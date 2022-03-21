const DraggableMixin = {
	drag(e) {
		this.setDrag(Mouse.fromEvent(e));
	},
	setDrag(offset) {
		const pos = this.position;
		//if (this.width != null) this.width += 4;
		if (this.transition)
			this.transition.transform = null;
		this.dragOffset = {
			x: pos.x - offset.x, // / Camera.scale,
			y: pos.y - offset.y, // / Camera.scale,
		};
	},
	drop(e) {
		if (!this.grabbed()) return;
		//if (this.width != null) this.width -= 4;
		this.dragOffset = null;
	},
	grabbed() {
		return this.dragOffset != null;
	},
};


Mixins.Draggable = (object) => {
	Inject(object, "mousemove", (e) => {
		if (!object.grabbed()) return;
		const mouse = object.inHand ? (Mouse.screen) : Mouse.fromEvent(e);
		const pos = object.position;
		pos.x = (mouse.x / Camera.scale + object.dragOffset.x);
		pos.y = (mouse.y / Camera.scale + object.dragOffset.y);
		object.position = pos;
	});
	Object.assign(object, DraggableMixin);
};
