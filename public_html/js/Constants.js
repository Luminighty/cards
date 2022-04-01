
let RotationConstant = Math.PI / 18;

{

	let nextRotationConstant = 1;
	/** @type {Array<[string, number]>} */
	const RotationConstants = [
		["10°", Math.PI / 18],
		["45°", Math.PI / 4],
		["60°", Math.PI / 3],
		["90°", Math.PI / 2],
	];

	const SetRotationConstant = () => {
		RotationConstant = RotationConstants[nextRotationConstant][1];
		nextRotationConstant++;
		nextRotationConstant %= RotationConstants.length;
	};
	
	const BoardContextMenu = new ContextMenu()
		.button("", SetRotationConstant, { onShow: (_, item) => { 
			item.innerText = `Set Rotation to ${RotationConstants[nextRotationConstant][0]}`; 
		}})
		.button("Reset Camera", () => Camera.reset())
		.subMenu("Camera Rotation", (menu) => 
			menu.button("0°", () => Camera.rotation = 0)
			.button("45°",  () => Camera.rotation = Math.PI * 1 / 4)
			.button("90°",  () => Camera.rotation = Math.PI * 2 / 4)
			.button("135°", () => Camera.rotation = Math.PI * 3 / 4)
			.button("180°", () => Camera.rotation = Math.PI * 4 / 4)
			.button("225°", () => Camera.rotation = Math.PI * 5 / 4)
			.button("270°", () => Camera.rotation = Math.PI * 6 / 4)
			.button("315°", () => Camera.rotation = Math.PI * 7 / 4)
		);

	document.body.addEventListener("contextmenu", (e) => {
		if (DraggedElement)
			return;
		if (IsHoveringOverObject())
			return;
		BoardContextMenu.open(e, null);
		e.preventDefault();
	});
}