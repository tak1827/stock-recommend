const db = require('./mongod-client')
const conf = require('./../conf/indexes')


const sumEnd = (stocks, period, index) => {
  const sliced = stocks.slice(index - period + 1, index + 1)
  return sliced.reduce((ac, cu) => typeof ac == 'number' ? ac + cu.end : ac.end + cu.end)
}

const getMaxMin = (stocks, period, index) => {
  const sliced = stocks.slice(index - period + 1, index + 1)
  const max = sliced.reduce((ac, cu) => {
    ac = typeof ac == 'number' ? ac : ac.end
    return ac > cu.end ? ac : cu.end
  })
  const min = sliced.reduce((ac, cu) => {
    ac = typeof ac == 'number' ? ac : ac.end
    return ac < cu.end ? ac : cu.end
  })
  return { max, min }
}

const calculateStandardDeviation = (stocks, period, index) => {
  const sliced = stocks.slice(index - period + 1, index + 1)
  return Math.sqrt(
    sliced.reduce((ac, cu) =>
      typeof ac == 'number'
        ? ac + Math.pow((cu.end - stocks[index][`mv_${period}`]), 2)
        : Math.pow((ac.end - stocks[index][`mv_${period}`]), 2) + Math.pow((cu.end - stocks[index][`mv_${period}`]), 2)
    ) / (period - 1))
}

const calculateMovingAverage = (stocks) => {
  conf.mv.periods.forEach(period => {
    stocks.forEach((stock, i) => {
      if (i + 1 < period) return

      // Simple Moving Average
      const av = parseInt(sumEnd(stocks, period, i) / period)

      // Exponentially Smoothed Moving Average
      const ex = i + 1 ===  period ? av : parseInt(stocks[i-1].end + 2*(stocks[i].end - stocks[i-1].end)/(period + 1))

      stocks[i] = {...stocks[i], [`mv_${period}`]: av, [`ex_${period}`]: ex}
    })
  })
  return stocks
}

const calculateBollingerBand = (stocks) => {
  conf.bb.periods.forEach(period => {
    stocks.forEach((stock, i) => {
      if (i + 1 < period) return
      const standardDeviation = calculateStandardDeviation(stocks, period, i)
      const bb = ((stocks[i].end - stocks[i][`mv_${period}`]) / standardDeviation).toPrecision(2)
      stocks[i] = {...stocks[i], [`bb_${period}`]: bb }
    })
  })
  return stocks
}

const calculateChannelBreakout = (stocks) => {
  conf.cb.periods.forEach(period => {
    stocks.forEach((stock, i) => {
      if (i + 1 < period) return
      const { max, min } = getMaxMin(stocks, period, i)
      stocks[i] = {...stocks[i], [`max_${period}`]: max, [`min_${period}`]: min }
    })
  })
  return stocks
}

const calculate = async (code, startDate, endDate) => {
  const firstStock = await db.findOne(code, undefined, {date: 1})
  const lastStock = await db.findOne(code, undefined, {date: -1})
  const start = startDate ? startDate : firstStock.date
  const end = endDate ? endDate : lastStock.date
  let stocks = await db.find(code ,{$and: [{date: {$gte: start}},{date: {$lte: end}}] }, {date: 1})
  stocks = calculateMovingAverage(stocks)
  stocks = calculateBollingerBand(stocks)
  stocks = calculateChannelBreakout(stocks)
  await db.multiUpdate(code, stocks)
}

module.exports = {
  calculate
}
