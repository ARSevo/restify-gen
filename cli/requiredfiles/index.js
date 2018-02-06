const router = new (require('restify-router')).Router();

router.get('/', function (req, res, next) {
	res.json({
		message: 'Welcome to API',
		query: req.query
	});
	next();
});

router.get('/:name', function (req, res, next) {
	res.json({
		message: `Welcome to API ${req.params.name}`,
		query: req.query
	});
	next();
});

router.post('/', function (req, res, next) {
	res.json({
		message: `Welcome to API ${req.body.name}`,
		query: req.query
	});
	next();
});

module.exports = router;