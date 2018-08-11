const db = require('./db')
module.exports.help = module.exports.start = () => {
	return `Send or forward a image here, and I will search it on SauceNAO for you!
Source Code: [maple3142/saucenao-search-tgbot](https://github.com/maple3142/saucenao-search-tgbot)`
}

const SUPPORTED_VALUES = {
	ms: 'Mininum similarity'
}
const UNSUPPORTED_MSG =
	'Available config values:\n' +
	Object.keys(SUPPORTED_VALUES)
		.map(k => `${k}: ${SUPPORTED_VALUES[k]}`)
		.join('\n')
module.exports.set = async (msg, cfg, val) => {
	if (cfg === 'ms') {
		const ms = parseInt(val)
		if (isNaN(ms)) {
			return 'Invalid minium similarity.'
		}
		await db.setUserMinSimilarity(msg.from.id, ms)
		return 'Minium similarity has been successfully updated.'
	} else {
		return UNSUPPORTED_MSG
	}
}
module.exports.get = async (msg, cfg) => {
	if (cfg === 'ms') {
		return db.getUserMinSimilarity(msg.from.id)
	} else {
		return UNSUPPORTED_MSG
	}
}
