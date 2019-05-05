import TelegramBot = require('node-telegram-bot-api')
import { Message } from 'node-telegram-bot-api'
import * as db from './db'
import { MIN_SIMILARITY, MAX_RESULT_COUNT } from './defaultvalues'

export function help(bot: TelegramBot, msg: Message) {
	bot.sendMessage(
		msg.chat.id,
		`Send or forward a image here, and I will search it on SauceNAO for you!
Source Code: [maple3142/saucenao-search-tgbot](https://github.com/maple3142/saucenao-search-tgbot)`,
		{
			parse_mode: 'Markdown'
		}
	)
}
export const start = help

const SUPPORTED_VALUES = {
	min_s: 'Mininum similarity',
	max_rc: 'Maximum result count'
}
const UNSUPPORTED_MSG =
	'Configurable values:\n' +
	Object.entries(SUPPORTED_VALUES)
		.map(([k, v]) => `${k}: ${v}`)
		.join('\n')
export async function set(bot: TelegramBot, msg: Message, cfg: string, val: string) {
	if (cfg === 'min_s') {
		const min_s = parseInt(val)
		if (isNaN(min_s)) {
			return bot.sendMessage(msg.from!.id, 'Invalid minium similarity.')
		}
		await db.setUserData(msg.from!.id, 'min_similarity', min_s)
		bot.sendMessage(msg.chat.id, 'Minium similarity has been successfully updated.')
	} else if (cfg === 'max_rc') {
		const max_rc = parseInt(val)
		if (isNaN(max_rc)) {
			return bot.sendMessage(msg.from!.id, 'Invalid maximum result count.')
		}
		await db.setUserData(msg.from!.id, 'max_result_count', max_rc)
		bot.sendMessage(msg.chat.id, 'Maximum result count has been successfully updated.')
	} else {
		bot.sendMessage(msg.chat.id, UNSUPPORTED_MSG)
	}
}
export async function get(bot: TelegramBot, msg: Message, cfg: string) {
	if (cfg === 'min_s') {
		bot.sendMessage(msg.from!.id, (await db.getUserData(msg.from!.id, 'min_similarity', MIN_SIMILARITY)).toString())
	} else if (cfg === 'max_rc') {
		bot.sendMessage(
			msg.chat.id,
			(await db.getUserData(msg.from!.id, 'max_result_count', MAX_RESULT_COUNT)).toString()
		)
	} else {
		bot.sendMessage(msg.chat.id, UNSUPPORTED_MSG)
	}
}
