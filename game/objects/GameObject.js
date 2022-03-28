
const { id } = require("../../utils/id");

class GameObject {
	/**
	 * @param {ObjectData} data 
	 */
	constructor(data) {
		this.id = id();
		this.image = data.image;
		this.width = data.width || 100;
		this.transform = {
			position: data.position || {x: 0, y: 0},
			rotation: data.rotation || 0,
			scale: data.scale || {x: 1, y: 1},
		};
		this.locked = false;
	}

	simplified(player) {
		return {
			id: this.id,
			image: this.image,
			transform: this.transform,
			width: this.width,
			locked: this.locked,
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

module.exports = GameObject;