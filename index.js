// https://github.com/yagop/node-telegram-bot-api/issues/476
process.env.NTBA_FIX_319 = 1

const { MINIUM_SIMILARITY, SAUCENAO_APIKEY, TG_TOKEN, PORT, WEBHOOK_URL } = require('./config')
const { createExtraMsgs } = require('./utils')
const SauceNAO = require('saucenao')
const TelegramBot = require('node-telegram-bot-api')
const debug = require('debug')
const $log = debug('saucenao-tg:log')
const $info = debug('saucenao-tg:info')

const search = new SauceNAO(SAUCENAO_APIKEY)

const bot = new TelegramBot(TG_TOKEN, { webHook: { autoOpen: false, port: PORT } })

bot.openWebHook()
	.then(() => bot.setWebHook(WEBHOOK_URL + '/bot' + TG_TOKEN))
	.then(() => bot.getWebHookInfo())
	.then($log)

bot.on('text', msg => {
	$info(msg)
	if (msg.text.startsWith('/')) {
		const cmd = msg.text.slice(1).trim()
		if (cmd === 'about') {
			bot.sendMessage(
				msg.chat.id,
				`Send or forward a image here, and I will search it on SauceNAO for you!
Source Code: [maple3142/saucenao-search-tgbot](https://github.com/maple3142/saucenao-search-tgbot)`,
				{ parse_mode: 'Markdown' }
			)
		} else {
			bot.sendMessage(msg.chat.id, 'Command not found!')
		}
	} else {
		bot.sendMessage(
			msg.chat.id,
			'Send or forward a image here, and I will search it on SauceNAO for you!\n/about for more information.'
		)
	}
})

bot.on('photo', async msg => {
	const {
		photo,
		chat: { id }
	} = msg
	$info(id, msg)
	const imgobj = photo.sort((a, b) => b.file_size - a.file_size)[0]
	const link = await bot.getFileLink(imgobj.file_id)
	const { json: data } = await search(link)
	$info(id, link, data.results)
	const filteredResults = data.results.filter(r => parseFloat(r.header.similarity) >= MINIUM_SIMILARITY)
	for (const r of filteredResults) {
		await bot.sendPhoto(id, r.header.thumbnail, { caption: r.data.title ? r.data.title : '' })
		await bot.sendMessage(id, createExtraMsgs(r))
		$info(id, r)
	}
	if (filteredResults.length === 0) {
		await bot.sendMessage(id, 'No image found!')
	}
})
