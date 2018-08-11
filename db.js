const { MINIUM_SIMILARITY } = require('./config')
const { fncache } = require('./utils')
const { Client } = require('pg')
const debug = require('debug')
const $clog = (name, uid) => val => {
	debug(`saucenao-tg:db:${name}`)(uid, val)
	return val
}

const client = new Client({
	connectionString:
		'postgres://xkodchjqpjelpj:485b23f9231228e2bab2b2c725883ee5a8389802dba753ff54195ad16c3c78a2@ec2-50-17-250-38.compute-1.amazonaws.com:5432/di8qdgmmug00h', // eslint-disable-line max-len
	ssl: true
})

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
