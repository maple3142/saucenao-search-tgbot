function capitalFirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}
function addXXXIntoText(xxx, data) {
	// xxx is something like `id` `name`
	// it will transform a key`test_id` on data into `Test id: ${data.test}`
	return Object.keys(data)
		.filter(x => x.endsWith('_' + xxx))
		.map(x => ({ name: capitalFirst(x.split('_')[0]), key: x }))
		.map(({ name, key }) => `${name} ${xxx}: ${data[key]}`)
		.join('\n')
}
function createExtraMsgs({ header, data }) {
	let str = ''
	str += `Similarity: ${header.similarity}\n`
	str += addXXXIntoText('id', data) + '\n'
	str += addXXXIntoText('name', data) + '\n'
	if (data.ext_urls) str += data.ext_urls.join('\n')
	return str
}
module.exports = { capitalFirst, addXXXIntoText, createExtraMsgs, fncache }
