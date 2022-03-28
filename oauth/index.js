const express = require("express");
const Session = require("./session");
const fetch = require("node-fetch");

const discordAuth = express.Router();

discordAuth.use(async (req, res, next) => {
	const {code} = req.query;

	if (code) {
		const data = await getOauthData(code);
		console.log(data);
		const [id, expires] = await Session.create(data["access_token"], data["token_type"], data["refresh_token"], data["expires_in"]);
		res.cookie("session_id", id, {signed: true, expires: new Date(expires)})
		res.redirect("/");
		return;
	}

	const session = await Session.find(req.signedCookies["session_id"]);
	if (!session) {
		res.redirect(process.env["DISCORD_REDIRECT"]);
		return;
	}

	next();
});

async function getOauthData(code) {
	try {
		// @ts-ignore
		const oauthResult = await fetch("https://discord.com/api/oauth2/token", {
			method: "POST",
			body: new URLSearchParams({
				client_id: process.env["DISCORD_CLIENT_ID"],
				client_secret: process.env["DISCORD_CLIENT_KEY"],
				code,
				grant_type: 'authorization_code',
				redirect_uri: `${process.env["HOST"]}:${process.env["PORT"] || 5000}`,
				scope: 'identify',
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		});
		return await oauthResult.json();
	} catch (err) {
		console.error(err);
	}
}


module.exports = {discordAuth};