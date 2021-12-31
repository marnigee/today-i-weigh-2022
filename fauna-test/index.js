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
				weight: 100,
				date: '10112022',
				owner: 'user-test2'
			}
		})
	);
	// const results = await client.query(
	// 	q.Update(q.Ref(q.Collection('weights'), '319513428276281408'), {
	// 		data: {
	// 			weight: 122,
	// 		}
	// 	})
	// )
	console.log('results: ', results);
}

run();