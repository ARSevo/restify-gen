const restify = require('restify');
const bunyan = require('bunyan');
const Router = new (require('restify-router')).Router();
const server = restify.createServer({
	name: process.env.APPNAME || 'My API',
	version: '1.0.0',
});

const logger = require('./basic-logger');

const home = require('./routes/index');

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.throttle({
	burst: 10,  // Max 10 concurrent requests (if tokens)
	rate: 2,  	// Steady state: 2 request / 1 seconds
	ip: true,   // throttle per IP
}));

Router.add('/api', home);
Router.applyRoutes(server);

server.on('after', restify.plugins.metrics({ server: server }, function onMetrics(err, metrics) {
	logger.trace(`${metrics.method} ${metrics.path} ${metrics.statusCode} ${metrics.latency} ms`);
}));

server.listen(process.env.PORT || 8080, function () {
	logger.info('%s listening at %s', server.name, server.url);
});

server.on('uncaughtException', function (req, res, route, err) {
	logger.error(err);
});
