require('dotenv').config();
const faunadb = require('faunadb');
const q = faunadb.query;

console.log(require('dotenv').config());
console.log('secret: ', process.env.FAUNA_DB_SECRET);

var client = new faunadb.Client({
	secret: process.env.FAUNA_DB_SECRET,
	domain: 'db.us.fauna.com'
});

async function run() {
	const results = await client.query(
		q.Create(q.Collection('weights'), {
			data: {
				weight: 132,
				date: '10102022',
				owner: 'user-test'
			}
		})
	);
	console.log(results);
}

run();