require('dotenv').config();
const { Pool } = require('pg');


const pool = new Pool({
	connectionString: process.env["DATABASE_URL"],
	ssl: {
		rejectUnauthorized: false
	}
});

const week = 7 * 24 * 60 * 60 * 1000;

//const query = `INSERT INTO SESSIONS VALUES ('abc', 'asd', ${Date.now() + week})`;
const query = `SELECT * FROM SESSIONS`;

pool.query(query)
	.then(console.log)
	.catch(console.error);