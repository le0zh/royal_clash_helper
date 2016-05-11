'use strict';
var cors = require('cors');

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();

app.use(cors());

module.exports = app; // for testing

var config = {
	appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
	if (err) {
		throw err;
	}

	// install middleware
	swaggerExpress.register(app);

	var port = process.env.PORT || 9001;
	app.listen(port);
});