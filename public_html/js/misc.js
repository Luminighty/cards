const CSS = {
	UserDrag: (value) => {
		return `
		-webkit-user-drag: ${value};
		-khtml-user-drag: ${value};
		-moz-user-drag: ${value};
		-o-user-drag: ${value};
		user-drag: ${value};
		`;
	},

	UserSelect: (value) => {
		return `
		-webkit-user-select: ${value};
		-khtml-user-select: ${value};
		-moz-user-select: ${value};
		-o-user-select: ${value};
		user-select: ${value};
		`;
	}
}