const { Client } = require('pg')
const debug = require('debug')

const log = debug('saucenao-tg:db')
const $clog = (name, uid) => val => {
	debug(`saucenao-tg:db`)(uid, val)
	return val
}

const opts = {
	ssl: true
}
if (process.env.DATABASE_URL) {
	opts.connectionString = process.env.DATABASE_URL
}
const client = new Client(opts)

client.connect()

function isUserCreated(uid) {
	return client
		.query('SELECT uid FROM userdata WHERE uid=$1', [uid])
		.then(({ rows }) => rows.length > 0)
		.then(result => {
			log(`isUserCreated uid=${uid} result=${result}`)
			return true
		})
}
function createUser(uid) {
	return client
		.query('INSERT INTO userdata (uid,min_similarity,max_result_count) VALUES ($1,$2,$3)', [
			uid.toString(),
			process.env.MINIUM_SIMILARITY,
			process.env.MAX_RESULT_COUNT
		])
		.then(() => {
			log(`createUser uid=${uid}`)
			return true
		})
}
function getUserData(uid, field, defaultValue) {
	// field is guaranteed to come from trusted input
	return client
		.query(`SELECT ${field} FROM userdata WHERE uid=$1`, [uid.toString()])
		.then(({ rows }) => rows[0][field] || defaultValue)
		.then(result => {
			log(`getUserData uid=${uid} field=${field} result=${result}`)
			return result
		})
}
function setUserData(uid, field, value) {
	return client
		.query(`UPDATE userdata SET ${field}=$2 WHERE uid=$1`, [uid.toString(), value])
		.then(() => {
			log(`setUserData uid=${uid} field=${field} value=${value}`)
			return true
		})
}

module.exports = { isUserCreated, createUser, getUserData, setUserData }
