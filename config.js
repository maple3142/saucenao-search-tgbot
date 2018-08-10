const MAX_RESULT_COUNT = 1
const CAPTION_EXT_URLS_MAX_LEN = 10
const SAUCENAO_APIKEY = process.env.SAUCENAO_APIKEY
const TG_TOKEN = process.env.TG_TOKEN
const PORT = process.env.PORT || 8443
const HOST = process.env.HOST || '127.0.0.1'
const WEBHOOK_URL = process.env.WEBHOOK_URL

module.exports = { MAX_RESULT_COUNT, CAPTION_EXT_URLS_MAX_LEN, SAUCENAO_APIKEY, TG_TOKEN, PORT, HOST, WEBHOOK_URL }
