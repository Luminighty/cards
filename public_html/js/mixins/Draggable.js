let DraggedElement = null;
const DraggableMixin = {
	drag(e, relativeTo) {
		const offset = relativeTo
			? {
					x: e.clientX,// + relativeTo.x,
					y: e.clientY,
					skipScale: true,// + relativeTo.y,
			  }
			: Mouse.fromEvent(e);		
		this.setDrag(offset);
	},
	setDrag(offset) {
		if (Camera._grabbed || Camera._rotating || this.locked)
			return;

		const pos = this.position;
		if (this.width != null) 
			this.width += 4;
		if (this.transition)
			this.transition.transform = null;
		if (this.rotation != null && !Hand.contains(this))
			this.rotation = this.rotation - this.rotation % (Math.PI * 2) - Camera.rotation;
		const scale = (offset.skipScale) ? 1 : Camera.scale;
		this.dragOffset = {
			x: pos.x - offset.x / scale,
			y: pos.y - offset.y / scale,
			skipScale: offset.skipScale,
		};
		DraggedElement = this;
	},
	drop(e) {
		if (!this.grabbed()) return;
		if (this.width != null) this.width -= 4;
		this.dragOffset = null;
		DraggedElement = null;
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
		const scale = object.dragOffset.skipScale ? 1 : Camera.scale;
		pos.x = (mouse.x / scale + object.dragOffset.x);
		pos.y = (mouse.y / scale + object.dragOffset.y);
		object.position = pos;
	});
	Object.assign(object, DraggableMixin);
};
