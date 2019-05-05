const db = require('./db')

/**
 * @param {TelegramBot} bot
 */
module.exports.help = module.exports.start = (bot, msg) => {
	bot.sendMessage(
		msg.chat.id,
		`Send or forward a image here, and I will search it on SauceNAO for you!
Source Code: [maple3142/saucenao-search-tgbot](https://github.com/maple3142/saucenao-search-tgbot)`,
		{
			parse_mode: 'Markdown'
		}
	)
}

const SUPPORTED_VALUES = {
	min_s: 'Mininum similarity',
	max_rc: 'Maximum result count'
}
const UNSUPPORTED_MSG =
	'Available config values:\n' +
	Object.keys(SUPPORTED_VALUES)
		.map(k => `${k}: ${SUPPORTED_VALUES[k]}`)
		.join('\n')
module.exports.set = async (bot, msg, cfg, val) => {
	if (cfg === 'min_s') {
		const min_s = parseInt(val)
		if (isNaN(min_s)) {
			return bot.sendMessage(msg.chat.id, 'Invalid minium similarity.')
		}
		await db.setUserData(msg.from.id, 'min_similarity', min_s)
		bot.sendMessage(msg.chat.id, 'Minium similarity has been successfully updated.')
	} else if (cfg === 'max_rc') {
		const max_rc = parseInt(val)
		if (isNaN(max_rc)) {
			return bot.sendMessage(msg.chat.id, 'Invalid maximum result count.')
		}
		await db.setUserData(msg.from.id, 'max_result_count', max_rc)
		bot.sendMessage(msg.chat.id, 'Maximum result count has been successfully updated.')
	} else {
		bot.sendMessage(msg.chat.id, UNSUPPORTED_MSG)
	}
}
module.exports.get = async (bot, msg, cfg) => {
	if (cfg === 'min_s') {
		bot.sendMessage(msg.chat.id, await db.getUserData(msg.from.id, 'min_similarity', process.env.MIN_SIMILARITY))
	} else if (cfg === 'max_rc') {
		bot.sendMessage(
			msg.chat.id,
			await db.getUserData(msg.from.id, 'max_result_count', process.env.MAX_RESULT_COUNT)
		)
	} else {
		bot.sendMessage(msg.chat.id, UNSUPPORTED_MSG)
	}
}
