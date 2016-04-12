'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// 新闻列表项
var NewsDetailSchema = new Schema({
	title: { type: String },
	publishTime: { type: String },
	source: { type: String },

	content: { type: String }
});

mongoose.model('NewsDetail', NewsDetailSchema);