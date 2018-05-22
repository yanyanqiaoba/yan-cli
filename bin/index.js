#! /usr/bin/env node

const program = require('commander'); //自定义命令
const chalk = require('chalk'); //颜色插件
const pkg = require('../package.json');

const newCli = require('../lib/new');
const generateCli = require('../lib/generate');

program.version(pkg.version)
  .option('new', 'init RED Design QA Demo')
  .option('new --no-auto-install', 'init RED Design QA Demo without npm install')
  .option('g', 'generate a new page with model and page and route')
  .parse(process.argv);

if (program.new) {
  newCli(process.argv);
}

if (program.g) {
  generateCli(process.argv);
}