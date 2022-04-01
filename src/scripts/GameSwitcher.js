// @ts-nocheck
const prompts = require('prompts');
const request = require("request");
require('dotenv').config();

const { Games } = require("../../resources/GameLoader");

const initialUrl = 0;

const form = [
	{
		type: 'select',
		name: 'url',
		message: 'Pick the URL',
		choices: [
			{ title: 'Heroku', value: "https://lumi-online-tabletop.herokuapp.com" },
			{ title: 'Localhost', value: "http://localhost:5000" },
		],
		initial: initialUrl,
	},
	{
		type: 'select',
		name: 'game',
		message: 'Pick a new game',
		choices: Object.keys(Games).map((game) => ({
			title: game,
			value: game,
		})),
	}
];

(async () => {
	const response = await prompts(form);
	if (!response.url || !response.game) {
		console.log("Nevermind");
		return;
	}

	const url = `${response.url}/set/${response.game}/${process.env["ADMIN_KEY"]}`;

	request.post(url, {}, (err, res, body) => {
		if (err)
			console.error(err);
		console.log(body);
	});
})();
