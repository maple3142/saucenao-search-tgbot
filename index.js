// https://github.com/yagop/node-telegram-bot-api/issues/476
process.env.NTBA_FIX_319 = 1

require('dotenv').config()

const { createExtraMsgs } = require('./utils')
const SauceNAO = require('saucenao')
const TelegramBot = require('node-telegram-bot-api')
const debug = require('debug')
const $log = debug('saucenao-tg:log')
const $info = debug('saucenao-tg:info')

const cmdHandlers = require('./cmd')
const db = require('./db')

const search = new SauceNAO(process.env.SAUCENAO_APIKEY)
const bot = new TelegramBot(process.env.TG_TOKEN, { webHook: { autoOpen: false, port: process.env.PORT || 8443 } })

bot.openWebHook()
	.then(() => bot.setWebHook((process.env.WEBHOOK_URL || '127.0.0.1') + '/bot' + process.env.TG_TOKEN))
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
	if (msg.text.startsWith('/')) {
		const [cmd, ...args] = msg.text
			.slice(1)
			.split(' ')
			.map(x => x.trim())
		if (cmd in cmdHandlers) {
			await cmdHandlers[cmd](bot, msg, ...args)
		} else {
			bot.sendMessage(msg.chat.id, 'Command not found!')
		}
	} else {
		cmdHandlers.help(bot, msg)
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
	const min_s = await db.getUserData(uid, 'min_similarity', parseInt(process.env.MIN_SIMILARITY))
	const max_rc = await db.getUserData(uid, 'max_result_count', parseInt(process.env.MAX_RESULT_COUNT))
	const filteredResults = data.results.filter(r => parseFloat(r.header.similarity) >= min_s).slice(0, max_rc)
	for (const r of filteredResults) {
		await bot.sendPhoto(id, r.header.thumbnail, { caption: r.data.title ? r.data.title : '' })
		await bot.sendMessage(id, createExtraMsgs(r))
		$info(`Data sent to ${id}`, r)
	}
	if (filteredResults.length === 0) {
		await bot.sendMessage(id, 'No image found!')
	}
})
