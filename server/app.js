'use strict'

const eventproxy = require('eventproxy');
const superagent = require('superagent');
const cheerio = require('cheerio');

const Models = require('./models');

/**
 * 读取新闻列表，并存储到DB
 * @param  {int} page 请求的页码
 */
function fetchNewsList(page) {
	if (page < 0) {
		throw new Error('请求的页码不能为负数');
	}

	let pageStr = (page - 1) === 0 ? '' : `_${page-1}`;
	let newsUrl = `http://cr.17173.com/list/zx${pageStr}.shtml`;

	superagent.get(newsUrl).end((err, res) => {
		if (err) {
			return console.error(err);
		}

		const $ = cheerio.load(res.text);
		const listItems = [];

		$(".list-news3 .list-item").each((index, element) => {
			const $element = $(element);

			const item = {};

			// 概述信息
			const descElement = $element.find($('.detail a'))[0];
			item.desc = $(descElement).text();
			item.detailUrl = $(descElement).attr('href');

			// 过滤【专题】的帖子
			if (~item.detailUrl.indexOf('/zt/')) {
				return true; // continue
			}

			// 图片信息
			const imgElement = $element.find($('.art-item-c1 a img'))[0];
			item.img = $(imgElement).attr('src');

			// 标题信息
			const titleLink = $element.find($('h3.tit a'))[0];
			item.title = $(titleLink).text();

			// 发布时间
			const timeElement = $element.find($('.info .c1'))[0];
			let publishTimeStr = $(timeElement).text();
			if (~publishTimeStr.indexOf('：')) {
				publishTimeStr = publishTimeStr.slice(publishTimeStr.indexOf('：') + 1);
			}
			item.publishTime = publishTimeStr;

			listItems.push(item);
		});

		const ep = new eventproxy();

		listItems.forEach(item => {
			const newsListItem = new Models.NewsListItem(item);
			newsListItem.includeTime = new Date();
			newsListItem.save().then((model) => {
				console.log(model._id);
				fetchNewsDetail(model).then(detailId => {
					// 保存详情之后，更新列表项中的详情id属性
					model.detailId = detailId;
					model.save().then(() => {
						// done
						ep.emit('save_done');
					})
				});
			});
		});

		ep.after('save_done', listItems.length, () => {
			console.log('save done', listItems.length);
			process.exit(1);
		});
	});
}

/**
 * 拉取新闻详情内容
 * @param  {object} listItem    新闻列表项
 */
function fetchNewsDetail(listItem) {
	return new Promise((resolve, reject) => {
		const detail = new Models.NewsDetail({
			title: listItem.title,
			publishTime: listItem.publishTime,
			source: listItem.source
		});

		superagent.get(listItem.detailUrl).end((err, res) => {
			if (err) {
				reject(err);
			}

			const $ = cheerio.load(res.text, { decodeEntities: false });

			// 过滤掉第一个广告用的段落
			$('.content.article-content.article-con p').first().remove();
			detail.content = $('.content.article-content.article-con').html();

			detail.save().then(model => {
				// 返回新建详情模型的_id
				resolve(model._id);
			});
		});
	});
}

fetchNewsList(3);

// superagent.get('http://cr.17173.com/content/04122016/101255146.shtml').end((err, res) => {
// 	if (err) {
// 		console.error(err);
// 	}

// 	const $ = cheerio.load(res.text, { decodeEntities: false });

// 	// 过滤掉第一个广告用的段落
// 	$('.content.article-content.article-con p').first().remove();
// 	const content = $('.content.article-content.article-con');
// 	console.log(content.html());

// 	process.exit(1);
// });