import { Client } from 'pg'
import debug from 'debug'

const log = debug('saucenao-tg:db')

const opts: any = {
	ssl: true
}
if (process.env.DATABASE_URL) {
	opts.connectionString = process.env.DATABASE_URL
}
const client = new Client(opts)

client.connect()

type UID = string | number
export function isUserCreated(uid: UID) {
	return client
		.query('SELECT uid FROM userdata WHERE uid=$1', [uid.toString()])
		.then(({ rows }) => rows.length > 0)
		.then(result => {
			log(`isUserCreated uid=${uid} result=${result}`)
			return result
		})
}
export function createUser(uid: UID) {
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
export function getUserData<T>(uid: UID, field: string, defaultValue: T): Promise<T> {
	// field is guaranteed to come from trusted input
	return client
		.query(`SELECT ${field} FROM userdata WHERE uid=$1`, [uid.toString()])
		.then(({ rows }) => rows[0][field] || defaultValue)
		.then(result => {
			log(`getUserData uid=${uid} field=${field} result=${result}`)
			return result
		})
}
export function setUserData<T>(uid: UID, field: string, value: T): Promise<boolean> {
	return client.query(`UPDATE userdata SET ${field}=$2 WHERE uid=$1`, [uid.toString(), value]).then(() => {
		log(`setUserData uid=${uid} field=${field} value=${value}`)
		return true
	})
}
