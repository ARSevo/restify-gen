const Router = new (require('restify-router')).Router();

Router.get('/', function (req, res, next) {
	res.json({
		message: 'Welcome to API',
		query: req.query
	});

	next();
});

Router.get('/:name', function (req, res, next) {
	res.json({
		message: `Welcome to API ${req.params.name}`,
		query: req.query
	});
	next();
});

Router.post('/', function (req, res, next) {
	res.json({
		message: `Welcome to API ${req.body.name}`,
		query: req.query
	});
	next();
});

module.exports = Router;