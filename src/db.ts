import { Client } from 'pg'
import debug from 'debug'
import Knex = require('knex')

const log = debug('saucenao-tg:db')

const opts: Knex.Config = {}
if (process.env.DB_TYPE && process.env.DB_URL) {
	opts.client = process.env.DB_TYPE
	opts.connection = process.env.DB_URL
}
const db = Knex(opts)

type UID = string | number
export function isUserCreated(uid: UID) {
	return db('userdata')
		.select('uid')
		.where({ uid: uid.toString() })
		.then(rows => rows.length > 0)
		.then(result => {
			log(`isUserCreated uid=${uid} result=${result}`)
			return result
		})
}
export function createUser(uid: UID) {
	return db('userdata')
		.insert({
			uid: uid.toString(),
			min_similarity: process.env.MINIUM_SIMILARITY,
			max_result_count: process.env.MAX_RESULT_COUNT
		})
		.then(() => {
			log(`createUser uid=${uid}`)
			return true
		})
}
export function getUserData<T>(
	uid: UID,
	field: string,
	defaultValue: T
): Promise<T> {
	// field is guaranteed to come from trusted input
	return db('userdata')
		.select(field)
		.where({ uid: uid.toString() })
		.then(rows => rows[0][field] || defaultValue)
		.then(result => {
			log(`getUserData uid=${uid} field=${field} result=${result}`)
			return result
		})
}
export function setUserData<T>(
	uid: UID,
	field: string,
	value: T
): Promise<boolean> {
	return db('userdata')
		.update({ [field]: value })
		.where({ uid: uid.toString() })
		.then(() => {
			log(`setUserData uid=${uid} field=${field} value=${value}`)
			return true
		})
}
