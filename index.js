// https://github.com/yagop/node-telegram-bot-api/issues/476
process.env['NTBA_FIX_319'] = 1

const { MAX_RESULT_COUNT, SAUCENAO_APIKEY, TG_TOKEN, PORT, WEBHOOK_URL } = require('./config')
const { createExtraMsgs } = require('./utils')
const SauceNAO = require('saucenao')
const TelegramBot = require('node-telegram-bot-api')
const debug = require('debug')
const $log = debug('saucenao-tg')
const $info = debug('saucenao-tg:info')

const search = new SauceNAO(SAUCENAO_APIKEY)

const bot = new TelegramBot(TG_TOKEN, { webHook: { autoOpen: false, port: PORT } })

bot.setWebHook(WEBHOOK_URL + '/bot' + TG_TOKEN)
	.then(() => bot.openWebHook())
	.then(() => bot.getWebHookInfo())
	.then($log)

bot.on('photo', async msg => {
	const {
		photo,
		chat: { id }
	} = msg
	$info(id, msg)
	const imgobj = photo.sort((a, b) => b.file_size - a.file_size)[0]
	const link = await bot.getFileLink(imgobj.file_id)
	const { json: data } = await search(link)
	$info(id, data)
	for (const r of data.results.slice(0, MAX_RESULT_COUNT)) {
		await bot.sendPhoto(id, r.header.thumbnail, { caption: r.data.title ? r.data.title : '' })
		await bot.sendMessage(id, createExtraMsgs(r))
		$info(id, r)
	}
})
