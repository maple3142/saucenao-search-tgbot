// https://github.com/yagop/node-telegram-bot-api/issues/476
process.env.NTBA_FIX_319 = '1'

require('dotenv').config()

import TelegramBot = require('node-telegram-bot-api')
import { MAX_RESULT_COUNT, MIN_SIMILARITY } from './defaultvalues'
import debug from 'debug'
import * as cmdHandlers from './cmd'
import * as db from './db'
import search from './search'

const $log = debug('saucenao-tg:log')
const $info = debug('saucenao-tg:info')

const bot = new TelegramBot(process.env.TG_TOKEN || '', {
	webHook: { autoOpen: false, port: process.env.PORT || 8443 }
} as any) // temporary fix for: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/35206

bot.openWebHook()
	.then(() =>
		bot.setWebHook(
			(process.env.WEBHOOK_URL || '127.0.0.1') +
				'/bot' +
				process.env.TG_TOKEN
		)
	)
	.then(() => bot.getWebHookInfo())
	.then($log)
	.catch(err => {
		console.log(err)
	})

bot.on('message', async msg => {
	const uid = msg.from!.id
	if (!(await db.isUserCreated(uid))) {
		await db.createUser(uid)
	}
})

bot.on('text', async msg => {
	$info('Text message', JSON.stringify(msg))
	if (msg.text!.startsWith('/')) {
		const [cmd, ...args] = msg
			.text!.slice(1)
			.split(' ')
			.map(x => x.trim())
		if (cmd in cmdHandlers) {
			// cmdHandlers can't handle cmdHandlers[cmd]
			await (cmdHandlers as any)[cmd](bot, msg, ...args)
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
		chat: { id }
	} = msg
	const uid = msg.from!.id
	$info('Photo message', JSON.stringify(msg))
	const imgobj = photo!.sort((a, b) => b.file_size! - a.file_size!)[0]
	const link = await bot.getFileLink(imgobj.file_id)
	const results = await search(link)
	$info('SauceNAO result', id, link, JSON.stringify(results))
	const min_s = await db.getUserData(uid, 'min_similarity', MIN_SIMILARITY)
	const max_rc = await db.getUserData(
		uid,
		'max_result_count',
		MAX_RESULT_COUNT
	)
	const filteredResults = results
		.filter(r => r.similarity >= min_s)
		.slice(0, max_rc)
	for (const r of filteredResults) {
		if (r.thumbnail) {
			await bot.sendPhoto(id, r.thumbnail, {
				caption: r.title
			})
		}
		await bot.sendMessage(id, r.content + '\n' + r.links.join('\n'))
		$info(`Data sent to ${id}`, JSON.stringify(r))
	}
	if (filteredResults.length === 0) {
		await bot.sendMessage(id, 'No image found!')
	}
})
