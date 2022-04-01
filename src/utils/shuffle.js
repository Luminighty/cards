function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
};

function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min)) + min
}


module.exports = {shuffle, randomNumber};