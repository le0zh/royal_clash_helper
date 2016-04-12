'use strict'

const mongoose = require('mongoose');
const db = 'mongodb://127.0.0.1:27017/RoyalClash';

// 设置bluebird
mongoose.Promise = require('bluebird');

mongoose.connect(db, {
	server: {
		poolSize: 20
	}
}, function(err) {
	if (err) {
		console.error('connect to %s error: ', config.db, err.message);
		process.exit(1);
	}
});

require('./newsListItem');
require('./newsDetail');

exports.NewsListItem = mongoose.model('NewsListItem');
exports.NewsDetail = mongoose.model('NewsDetail');