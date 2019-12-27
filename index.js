#!/usr/bin/env node
const program = require('commander')
const { fetch } = require('./lib/web-scraping.js')

function parseDate(value, previous) {
  return new Date(value)
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
    // console.log(`${stockCode} ${cmdObj.start}`);
    fetch(stockCode, cmdObj.start, cmdObj.end)
  })

// TODO
program
  .command('clone <source> [destination]')
  .description('clone a repository into a newly created directory')
  .action((source, destination) => {
    console.log('clone command called');
  })

program.parse(process.argv)
