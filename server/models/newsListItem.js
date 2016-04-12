'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//model插件
const paged = require('./plugin/paged');

// 新闻列表项
const NewsListItemSchema = new Schema({
	title: { type: String },
	img: { type: String }, // 130 * 100
	desc: { type: String },
	publishTime: { type: String },
	source: { type: String },

	display: { type: Boolean, default: true }, // 是否显示，可以通过手工控制是否显示
	detailUrl: { type: String },
	includeTime: { type: Date, default: Date.now },
	//isDetailFectched: { type: Boolean, default: false } // 详情是否被收录
	detailId: { type: ObjectId } // 详情的id
});

//扩展插件
NewsListItemSchema.plugin(paged);

mongoose.model('NewsListItem', NewsListItemSchema);