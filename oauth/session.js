const { Pool } = require("pg/lib");

let sessionCache = [];

const pool = new Pool({
	connectionString: process.env["DATABASE_URL"],
	ssl: {
		rejectUnauthorized: false
	}
});

const Session = {};
Session.load = async () => {
	await pool.query("DELETE FROM SESSIONS WHERE expires < $1", [Date.now()]);

	const res = await pool.query("SELECT * FROM SESSIONS");
	sessionCache = res.rows.map((session) => ({
		id: session.id,
		access_token: session.access_token,
		type: session.token_type,
		refresh_token: session.refresh_token,
		expires: parseInt(session.expires),
	}));
};

Session.find = async (id) => {
	return sessionCache.find((session) => session.id == id && session.expires > Date.now());
};

Session.create = async (token, type, refresh, expires) => {
	const id = generateSessionId();
	expires = Date.now() + (expires || 604800) * 1000;
	console.log("Inserting: ", id, token, type, refresh, expires);
	await pool.query("INSERT INTO SESSIONS VALUES ($1, $2, $3, $4, $5)", [id, token, type, refresh, expires]);
	sessionCache.push({id, token, expires});
	return [id, expires];
};

function generateSessionId() {
	let str = ``;
	const num = Math.floor(Math.random() * 10);
	for (let i = 0; i < num + 20; i++)
		str += String.fromCharCode(33 + Math.floor(Math.random() * 94));
	return str;
}

module.exports = Session;