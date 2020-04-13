import got from 'got'
import FormData = require('form-data')
import cheerio = require('cheerio')

const search = async (url: string) => {
	const fd = new FormData()
	fd.append('file', Buffer.from([]))
	fd.append('url', url)
	fd.append('frame', 1)
	fd.append('hide', 0)
	fd.append('database', 999)
	const html = await got
		.post('https://saucenao.com/search.php', {
			headers: {
				Accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
				'Accept-Language': 'en-US',
				Origin: 'https://saucenao.com',
				Referer: 'https://saucenao.com/',
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
			},
			body: fd
		})
		.text()
	const $ = cheerio.load(html)
	const results = $('#middle .result:not(#result-hidden-notification)')
	const data = Array.from(results).map(r => {
		const $r = $(r)
		const title = $r.find('.resulttitle>strong').text()
		const links = Array.from($r.find('.resultcontent a')).map(a =>
			$(a).attr('href')
		)
		$r.find('.resultcontent').find('br').replaceWith('\n')
		const content = $r.find('.resultcontent').text()
		const similarity = parseFloat(
			$r.find('.resultsimilarityinfo').text().slice(0, -1)
		)
		const $img = $r.find('.resultimage img')
		const thumbnail = $img.attr('data-src') || $img.attr('src')
		return { title, links, content, similarity, thumbnail }
	})
	return data
}
export default search
