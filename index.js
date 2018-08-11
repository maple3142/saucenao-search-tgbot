// https://github.com/yagop/node-telegram-bot-api/issues/476
process.env.NTBA_FIX_319 = 1

const { SAUCENAO_APIKEY, TG_TOKEN, PORT, WEBHOOK_URL } = require('./config')
const { createExtraMsgs } = require('./utils')
const SauceNAO = require('saucenao')
const TelegramBot = require('node-telegram-bot-api')
const debug = require('debug')
const $log = debug('saucenao-tg:log')
const $info = debug('saucenao-tg:info')

const cmdHandlers = require('./cmd')
const db = require('./db')

const search = new SauceNAO(SAUCENAO_APIKEY)
const bot = new TelegramBot(TG_TOKEN, { webHook: { autoOpen: false, port: PORT } })

bot.openWebHook()
	.then(() => bot.setWebHook(WEBHOOK_URL + '/bot' + TG_TOKEN))
	.then(() => bot.getWebHookInfo())
	.then($log)

bot.on('message', async msg => {
	const uid = msg.from.id
	if (!(await db.isUserCreated(uid))) {
		await db.createUser(uid)
	}
})

bot.on('text', async msg => {
	$info(msg)
	const uid = msg.from.id
	if (msg.text.startsWith('/')) {
		const [cmd, ...args] = msg.text
			.slice(1)
			.split(' ')
			.map(x => x.trim())
		if (cmd in cmdHandlers) {
			const result = await cmdHandlers[cmd](msg, ...args)
			bot.sendMessage(msg.chat.id, result)
		} else {
			bot.sendMessage(msg.chat.id, 'Command not found!')
		}
	} else {
		bot.sendMessage(msg.chat.id, cmdHandlers.help())
	}
})

bot.on('photo', async msg => {
	const {
		photo,
		chat: { id },
		from: { id: uid }
	} = msg
	$info(id, msg)
	const imgobj = photo.sort((a, b) => b.file_size - a.file_size)[0]
	const link = await bot.getFileLink(imgobj.file_id)
	const { json: data } = await search(link)
	$info(id, link, data.results)
	const ms = await db.getUserMinSimilarity(uid)
	const filteredResults = data.results.filter(r => parseFloat(r.header.similarity) >= ms)
	for (const r of filteredResults) {
		await bot.sendPhoto(id, r.header.thumbnail, { caption: r.data.title ? r.data.title : '' })
		await bot.sendMessage(id, createExtraMsgs(r))
		$info(id, r)
	}
	if (filteredResults.length === 0) {
		await bot.sendMessage(id, 'No image found!')
	}
})
