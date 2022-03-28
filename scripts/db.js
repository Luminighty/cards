require('dotenv').config();
const { Pool } = require('pg');


const pool = new Pool({
	connectionString: process.env["DATABASE_URL"],
	ssl: {
		rejectUnauthorized: false
	}
});

const queries = [
	`DROP TABLE SESSIONS`,
	`CREATE TABLE SESSIONS (
		ID varchar(255) PRIMARY KEY,
		ACCESS_TOKEN varchar(255),
		TOKEN_TYPE varchar(255),
		REFRESH_TOKEN varchar(255),
		EXPIRES BIGINT
	)`,
];

(async () => {
	for (const query of queries) {
		try {
			const res = await pool.query(query);
			console.log(res);
		} catch (err) {
			console.error(err);
		}
	}
})();