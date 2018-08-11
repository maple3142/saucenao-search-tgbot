const { MINIUM_SIMILARITY, DATABASE_URL } = require('./config')
const { Client } = require('pg')
const debug = require('debug')
const $clog = (name, uid) => val => {
	debug(`saucenao-tg:db:${name}`)(uid, val)
	return val
}

const opts = {
	ssl: true
}
if (DATABASE_URL) {
	opts.connectionString = DATABASE_URL
}
const client = new Client(opts)

client.connect()

function isUserCreated(uid) {
	return client
		.query('SELECT uid FROM userdata WHERE uid=$1', [uid])
		.then(({ rows }) => rows.length > 0)
		.then($clog('isUserCreated', uid))
}
function createUser(uid) {
	return client
		.query('INSERT INTO userdata (uid,min_similarity) VALUES ($1,$2)', [uid.toString(), MINIUM_SIMILARITY])
		.then(() => true)
		.then($clog('createUser', uid))
}
function getUserMinSimilarity(uid) {
	return client
		.query('SELECT min_similarity FROM userdata WHERE uid=$1', [uid.toString()])
		.then(({ rows }) => rows[0].min_similarity || MINIUM_SIMILARITY)
		.then($clog('getUserMinSimilarity', uid))
}
function setUserMinSimilarity(uid, v) {
	return client
		.query('UPDATE userdata SET min_similarity=$2 WHERE uid=$1', [uid.toString(), v])
		.then(() => v)
		.then($clog('setUserMinSimilarity', uid))
}

module.exports = { isUserCreated, createUser, getUserMinSimilarity, setUserMinSimilarity }
