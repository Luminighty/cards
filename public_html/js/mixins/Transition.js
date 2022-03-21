Mixins.Transition = {};

Mixins.Transition.Transform = (object) => {
	object.transition = object.transition || {
		values: {},
		update(object) {
			const transition = Object.keys(this.values)
				.filter((key) => this.values[key])
				.map((key) => `${key} ${this.values[key]}`).join(', ');
			object.style.transition = transition;
		}
	};
	Object.defineProperty(object.transition, "transform", {
		get() { return object.transition.values["transform"]; },
		set(value) {
			object.transition.values["transform"] = value;
			object.transition.update(object);
		}
	});
}