const util = require("util");

const Logger = {};

Logger.log = async (message, ...args) => {
	const msg = util.format(message, ...args);
	console.log(msg);
};

module.exports = Logger;