#!/usr/bin/env node
const program = require('commander');
const shell = require('shelljs');
require('colors');

program.version('0.0.1')
	.usage('[options] applicationfolder')
	.option('-p, --port <port>', 'API port')
	.option('-f, --force', 'Clear contents of the application folder if exists')
	.parse(process.argv);

if (program.args.length < 1) {
	program.help();
}

//console.log(`Filename : ${__filename}`);
//console.log(`Directoryname : ${__dirname}`);

let appfolder = program.args[0];
if (program.force) {
	shell.rm('-rf', appfolder);
	shell.mkdir(program.args[0]);
} else if (!shell.test('-e', appfolder)) {
	shell.mkdir(program.args[0]);
}
else {
	console.log(`\n  The directory ${appfolder} already exists. Use --force to delete contents`.red); 
	program.help();
}

let folderpath = `./${appfolder}/`;

shell.cp('./requiredfiles/app.js', folderpath);
shell.cp('./requiredfiles/package.json', folderpath);
shell.cp('./requiredfiles/basic-logger.js', folderpath);
let routespath = `${folderpath}/routes`;
shell.mkdir(routespath);
shell.cp('./requiredfiles/index.js', routespath);