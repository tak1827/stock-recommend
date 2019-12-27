const https = require('https')
const cheerio = require('cheerio')

const YAHOO_STOCK_HISTOEY_URL = 'https://info.finance.yahoo.co.jp/history'

const parseQuery = (code, s, e) => {
  return `?code=${code}.T&sy=${s.getFullYear()}&sm=${s.getMonth()+1}&sd=${s.getDate()}&ey=${e.getFullYear()}&em=${e.getMonth()+1}&ed=${e.getDate()}&tm=d`
}

const scrapeStocks = ($, stocks = []) => {
  $('table.boardFin tr').each(function(i) {
    if(i === 0){ return }
    $td = $(this).find('td')
    stocks.push({
      date: $td.eq(0).text().replace(/年|月/g,'-').replace('日',''),
      open: parseInt($td.eq(1).text().replace(',','')),
      high: parseInt($td.eq(2).text().replace(',','')),
      low: parseInt($td.eq(3).text().replace(',','')),
      end: parseInt($td.eq(4).text().replace(',',''))
    })
  })
  return stocks
}

const scrateNextLink = ($) => {
  $last = $('ul.ymuiPagingBottom a').last()
  if ($last.text() != '次へ') return false
  return $last.attr('href')
}

const fetch = (url) => {
  return new Promise(function (resolve, reject) {
    https.get(url, (res) => {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          resolve(cheerio.load(rawData))
        } catch (e) {
          console.error(e.message);
          reject(e)
        }
      })
    })
  })
}

const recursiveFetch = async (url, stocks = []) => {
  const $ = await fetch(url)
  stocks = scrapeStocks($, stocks)
  const nexLink = scrateNextLink($)
  if (nexLink) {
    stocks = recursiveFetch(nexLink, stocks)
  }
  return stocks
}

const fetchStock = async (code, startDate, endDate) => {
  const url = `${YAHOO_STOCK_HISTOEY_URL}/${parseQuery(code, startDate, endDate)}`
  const stocks = await recursiveFetch(url)
  console.log(stocks)
}

module.exports = {
  fetch: fetchStock
}
