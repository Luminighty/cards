interface Vector2 {
	x: number,
	y: number,
}

interface Transform {
	transform: {
		position: Vector2,
		rotation: number,
		scale: Vector2,
	}
	position: Vector2,
	rotation: number,
	scale: Vector2,
}
