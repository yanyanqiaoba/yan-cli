#! /usr/bin/env node

const program = require('commander'); //自定义命令
const chalk = require('chalk'); //颜色插件
const pkg = require('../package.json');

const newCli = require('../lib/new');

program.version(pkg.version)
  .option('new', 'init RED Design QA Demo')
  .option('new --no-auto-install', 'init RED Design QA Demo without npm install')
  .parse(process.argv);

if (program.new) {
  newCli(process.argv);
}