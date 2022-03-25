let ZIndexStack = [];

Mixins.ZIndexStacked = (object, weight = 1) => {
	object.setZIndex = () => {
		if (object.zIndex != null && this.zIndex == ZIndexStack.length - 1)
			return;
		ZIndexStack = ZIndexStack.filter(([element, _]) => element.parentElement != null);
			
		const index = ZIndexStack.findIndex(([val, _]) => val.id == object.id);
		if (index != -1)
			ZIndexStack.splice(index, 1);
		ZIndexStack.push([object, weight]);
		let zIndex = 0;
		ZIndexStack.forEach(([object, weight]) => {
			object.zIndex = zIndex;
			zIndex += weight;
		});
	};
	if (object.zIndex == null)
	Object.defineProperty(object, "zIndex", {
		get() {
			return parseInt(object.style.zIndex);
		},
		set(value) {
			object.style.zIndex = `${value}`;
		}
	});
	ZIndexStack.push([object, weight]);
};
