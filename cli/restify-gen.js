#!/usr/bin/env node
var program = require('commander');

program.version('0.0.1')
	.usage('[options]')
	.command('name [apiname]', 'name of your API')
	.command('version [version]', 'version of your API')
	.parse(process.argv);