#!/usr/bin/env node
const appcontent = require('./templates/app');
const loggercontent = require('./templates/logger');
const packagecontent = require('./templates/package');
const routercontent = require('./templates/router');

const program = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const colors = require('colors');
const util = require('util');
const yellow = 'yellow';
const green = 'green';
const red = 'red';
const showmessage = (message = '', color = yellow) => console.log(colors[color](message));

program.version('1.0.4')
	.usage('[options] applicationfolder')
	.option('-n, --appname <appname>', 'api application name (default <applicationfolder>)')
	.option('-d, --appdescription <appdescription>', 'api application description (default My API Description)')
	.option('-v, --apiversion <apiversion>', 'api version (default 1.0.0)')
	.option('-p, --port <port>', 'api port (default 8080)')
	.option('-f, --force', 'clear contents of the application folder if exists')
	.parse(process.argv);

if (program.args.length < 1) {
	program.help();
}

const appfolder = program.args[0];
const selectedport = program.port || 8080;
const formatedAppContent = util.format(appcontent, program.appname || appfolder , program.apiversion || '1.0.0', selectedport);
const formatedPackageContent = util.format(packagecontent, program.appname || appfolder, program.apiversion || '1.0.0', program.appdescription || 'My API Description');
const formatedLoggerContent = util.format(loggercontent, program.appname || appfolder);

if (program.force) {
	shell.rm('-rf', appfolder);
	showmessage('Clear existing folder content');
	shell.mkdir(program.args[0]);
} else if (!shell.test('-e', appfolder)) {
	shell.mkdir(program.args[0]);
}
else {
	showmessage(`\n  The directory ${appfolder} already exists. Use --force to delete contents`, red);
	program.help();
	process.exit(1);
}
showmessage('Create project folder');

let folderpath = `./${appfolder}/`;
fs.writeFileSync(`${folderpath}/app.js`, formatedAppContent);
fs.writeFileSync(`${folderpath}/basic-logger.js`, formatedLoggerContent);
fs.writeFileSync(`${folderpath}/package.json`, formatedPackageContent);
showmessage('Generate application files');
let routespath = `${folderpath}/routes`;
shell.mkdir(routespath);
fs.writeFileSync(`${routespath}/index.js`, routercontent);
showmessage('Generate router sample (router/index.js)');

showmessage('Success => Application created', green);
showmessage(`\nGoto application folder\ncd ${appfolder}`, green);
showmessage('npm install', green);
showmessage('node app.js', green);
showmessage(`Your application root is http://localhost:${selectedport}/api`, green);


