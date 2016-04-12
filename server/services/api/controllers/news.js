'use strict';

const Models = require('../../../models');
const NewsListItem = Models.NewsListItem;
const NewsDetail = Models.NewsDetail;

module.exports = {
	list: list,
	detail: detail
};

function list(req, res) {
	const page = req.swagger.params.page.value || 1;

	NewsListItem.getPagedReuslt({ display: true }, page).then(data => {
		res.json(data);
	}).catch(err => {
		res.json({
			message: err
		});
	});
}

function detail(req, res) {
	const id = req.swagger.params.id.value || 1;

	NewsDetail.findOne({ _id: id }).then(model => {
		res.json(model);
	}).catch(err => {
		res.json({
			message: err
		});
	})
}