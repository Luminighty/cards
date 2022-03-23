const DraggableMixin = {
	drag(e, relativeTo) {
		const offset = relativeTo
			? {
					x: e.clientX,// + relativeTo.x,
					y: e.clientY// + relativeTo.y,
			  }
			: Mouse.fromEvent(e);		
		this.setDrag(offset);
	},
	setDrag(offset) {
		const pos = this.position;
		//if (this.width != null) this.width += 4;
		if (this.transition)
			this.transition.transform = null;
		if (this.rotation != null && !Hand.contains(this))
			this.rotation = -Camera.rotation;
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


/** @param {Object} object */
Mixins.Draggable = (object) => {
	Inject(object, "mousemove", (e) => {
		if (!object.grabbed()) return;
		const mouse = Hand.contains(object) ? (Mouse.screen) : Mouse.fromEvent(e);
		const pos = object.position;
		pos.x = (mouse.x / Camera.scale + object.dragOffset.x);
		pos.y = (mouse.y / Camera.scale + object.dragOffset.y);
		object.position = pos;
	});
	Object.assign(object, DraggableMixin);
};
