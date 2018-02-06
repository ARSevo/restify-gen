#!/usr/bin/env node
//#region Contents

const routercontent = `const router = new (require(\'restify-router\')).Router();

router.get('/', function (req, res, next) {
	res.json({
		message: 'Welcome to API',
		query: req.query
	});
	next();
});

router.get('/:name', function (req, res, next) {
	res.json({
		message: \`Welcome to API \${req.params.name}\`,
		query: req.query
	});
	next();
});

router.post('/', function (req, res, next) {
	res.json({
		message: \`Welcome to API \${req.body.name}\`,
		query: req.query
	});
	next();
});

module.exports = router;`;


const appcontent = `const restify = require('restify');
const router = new (require('restify-router')).Router();
const server = restify.createServer({
	name: '%s',
	version: '%s',
});

const logger = require('./basic-logger');

const home = require('./routes/index');

server.use(restify.plugins.throttle({
	burst: 100,  	// Max 10 concurrent requests (if tokens)
	rate: 2,  		// Steady state: 2 request / 1 seconds
	ip: true,		// throttle per IP
}));
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());

router.add('/api', home);
router.applyRoutes(server);

server.on('after', restify.plugins.metrics({ server: server }, function onMetrics(err, metrics) {
	logger.trace(\`\${metrics.method} \${metrics.path} \${metrics.statusCode} \${metrics.latency} ms\`);
}));

server.listen(%d, function () {
	logger.info('%s listening at %s', server.name, server.url);
});

server.on('uncaughtException', function (req, res, route, err) {
	logger.error(err);
});`;

const loggercontent = `const bunyan = require('bunyan');
const fs = require('fs');

// create logs directory if not exists.
fs.existsSync('logs') || fs.mkdirSync('logs');

module.exports = bunyan.createLogger({
	name: process.env.APPNAME || 'My API',
	streams: [{
		type: 'rotating-file',
		path: 'logs/info.log',
		period: '1d',
		level: 'info',
		count: 3
	}, {
		type: 'rotating-file',
		path: 'logs/error.log',
		period: '1d',
		level: 'error',
		count: 7
	}, {
		type: 'rotating-file',
		path: 'logs/trace.log',
		period: '1d',
		level: 'trace',
		count: 3
	}]
});`

const packagecontent = `{
	"name": "restify-gen",
	"version": "1.0.0",
	"description": "Restify boilerplate",
	"keywords": [
	  "restify",
	  "template",
	  "boilerplate"
	],
	"devDependencies": {
	  "eslint": "^4.16.0"
	},
	"dependencies": {
		"bunyan": "^1.8.12",
		"restify": "^6.3.4",
		"restify-router": "^0.5.0"
	}
}`;

//#endregion

const program = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const colors = require('colors');
const util = require('util');
const yellow = 'yellow';
const green = 'green';
const red = 'red';
showmessage = (message = '', color = yellow) => console.log(colors[color](message));

program.version('0.0.1')
.usage('[options] applicationfolder')
	.option('-n, --appname <appname>', 'api application name (default My API)')
	.option('-v, --apiversion <apiversion>', 'api version (default 1.0.0)')
	.option('-p, --port <port>', 'api port (default 8080)')
	.option('-f, --force', 'clear contents of the application folder if exists')
	.parse(process.argv);

if (program.args.length < 1) {
	program.help();
}

let selectedport = program.port || 8080;
let formatedAppContent = util.format(appcontent, program.appname || 'My API', program.apiversion || '1.0.0', selectedport);

let appfolder = program.args[0];
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
fs.writeFileSync(`${folderpath}/basic-logger.js`, loggercontent);
fs.writeFileSync(`${folderpath}/package.json`, packagecontent);
showmessage('Generate application files');
let routespath = `${folderpath}/routes`;
shell.mkdir(routespath);
fs.writeFileSync(`${routespath}/index.js`, routercontent);
showmessage('Generate router sample (router/index.js)');

showmessage('Success => Application created', green);
showmessage(`\nGoto application folder\ncd ${appfolder}`, green);
showmessage(`npm install`, green);
showmessage(`node app.js`, green);
showmessage(`Your application root is http://localhost:${selectedport}/api`, green);


