#!/usr/bin/env node
const program = require('commander')
const { fetch } = require('./lib/web-scraping')
const { calculate } = require('./lib/index-calculator')

function parseDate(value, previous) {
  if (value) return new Date(`${value}T00:00:00`)
}

program
  .version('1.0.0')

// Fetch specific stock
program
  .command('fetch <stockCode>')
  .description('Fetching a specific stock')
  .option('-s, --start <value>', 'string argument', parseDate)
  .option('-e, --end <value>', 'string argument', parseDate)
  .action((stockCode, cmdObj) => {
    fetch(stockCode, cmdObj.start, cmdObj.end)
  })

// Calculate indexes
program
  .command('calculate <stockCode>')
  .description('Fetching a specific stock')
  .option('-s, --start <value>', 'string argument', parseDate)
  .option('-e, --end <value>', 'string argument', parseDate)
  .action((stockCode, cmdObj) => {
    calculate(stockCode, cmdObj.start, cmdObj.end)
  })

// TODO
program
  .command('clone <source> [destination]')
  .description('clone a repository into a newly created directory')
  .action((source, destination) => {
    console.log('clone command called');
  })

program.parse(process.argv)
