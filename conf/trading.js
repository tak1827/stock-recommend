// Period of simulation, 1 month, 2 month etc..
const periods = [22, 44, 88, 176]

// Span of reflesh simpulation result
const reSimpulattionSpan = [1, 5, 25, 125]

const buyPositions = [
  // Simple Moving Average
  { index: "smv", value: [5,10] },
  { index: "smv", value: [5,20] },
  { index: "smv", value: [5,40] },
  { index: "smv", value: [10,20] },
  { index: "smv", value: [10,40] },
  { index: "smv", value: [20,40] },

  // Exponentially Smoothed Moving Average
  { index: "emv", value: [5,10] },
  { index: "emv", value: [5,20] },
  { index: "emv", value: [5,40] },
  { index: "emv", value: [10,20] },
  { index: "emv", value: [10,40] },
  { index: "emv", value: [20,40] },

  // BollingerBand
  { index: "bb", value: 1 },
  { index: "bb", value: 1.5 },
  { index: "bb", value: 2 },
  { index: "bb", value: 2.5 },
  { index: "bb", value: 3 },

  // ChannelBreakout
  { index: "cb", value: 5 },
  { index: "cb", value: 10 },
  { index: "cb", value: 20 },
  { index: "cb", value: 40 },
]

const sellPositions = [
  { index: "smv", value: [5,10] },
  { index: "smv", value: [5,20] },
  { index: "smv", value: [5,40] },
  { index: "smv", value: [10,20] },
  { index: "smv", value: [10,40] },
  { index: "smv", value: [20,40] },

  { index: "emv", value: [5,10] },
  { index: "emv", value: [5,20] },
  { index: "emv", value: [5,40] },
  { index: "emv", value: [10,20] },
  { index: "emv", value: [10,40] },
  { index: "emv", value: [20,40] },

  { index: "bb", value: -1 },
  { index: "bb", value: -1.5 },
  { index: "bb", value: -2 },
  { index: "bb", value: -2.5 },
  { index: "bb", value: -3 },

  { index: "cb", value: 5 },
  { index: "cb", value: 10 },
  { index: "cb", value: 20 },
  { index: "cb", value: 40 },
]

module.exports = {
  periods,
  reSimpulattionSpan,
  buy: buyPositions,
  sell: sellPositions,
}