const {id} = require("../../utils/id");

class Dice {
	/**
	 * @param {DiceData} data 
	 */
	constructor(data) {
		this.id = id();
		this.image = DicePrefab.D6(data.image, data.width || 50);
		this._transform = {
			position: data.position || {x: 0, y: 0},
			rotation: data.rotation || 0,
			scale: data.scale || {x: 1, y: 1},
		};
		this.side = { x: 0, y: 0, index: 0, };
	}

	simplified(player) {
		return {
			id: this.id,
			image: this.image,
			transform: this.transform,
			side: this.side,
		};
	}

	set position(value) { this.transform.position = value; }
	get position() { return this._transform.position; }
	
	set rotation(value) { this.transform.rotation = value; }
	get rotation() { return this._transform.rotation; }
	
	set scale(value) { this.transform.scale = value; }
	get scale() { return this._transform.scale; }

	set transform(value) { this._transform = Object.assign({}, value); }
	get transform() {  return this._transform;}
}

Dice.MaxRoll = 3;

const Rotation = {};
Rotation.D6 = [
	{x: 0, y: 0},
	{x: Math.PI / 2, y: 0},
	{x: 0, y: -Math.PI / 2},
	{x: 0, y: Math.PI / 2},
	{x: -Math.PI / 2, y: 0},
	{x: Math.PI, y: 0},
];

const Transform = (rotation, size) => {
	let str = "";
	if (rotation.x)
		str += `rotateX(${rotation.x}rad)`;
	if (rotation.y)
		str += `rotateY(${rotation.y}rad)`;
	return `${str} translateZ(${size}px)`;
};

const DicePrefab = {};
DicePrefab.D6 = (images, size) =>
	images.map((image, index) => ({
		image,
		rotation: Rotation.D6[index],
		transform: `${Transform(Rotation.D6[index], size / 2)}`,
		size
	}));


module.exports = Dice;