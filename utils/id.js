function idGroup() {
	let lastId = 0;
	return () => lastId++;
}

const id = idGroup();

module.exports = {
	id, idGroup,
};