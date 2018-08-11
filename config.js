const MINIUM_SIMILARITY = 50
const SAUCENAO_APIKEY = process.env.SAUCENAO_APIKEY
const TG_TOKEN = process.env.TG_TOKEN
const PORT = process.env.PORT || 8443
const HOST = process.env.HOST || '127.0.0.1'
const WEBHOOK_URL = process.env.WEBHOOK_URL

module.exports = { MINIUM_SIMILARITY, SAUCENAO_APIKEY, TG_TOKEN, PORT, HOST, WEBHOOK_URL }
