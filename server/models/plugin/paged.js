'use strict'
/**
 * 给所有的 Model 扩展功能
 * http://mongoosejs.com/docs/plugins.html
 */
const Promise = require('bluebird');
const join = Promise.join;

//分页插件参考
//https://github.com/edwardhotchkiss/mongoose-paginate/blob/master/lib/mongoose-paginate.js
//获取分页结果
//@_query   : 查询条件
//@_index   : page index
//@_orderBy : 根据哪个字段排序
//@_size    : page size 
//@_extra   : 额外的条件 
//						extra.select 指定返回的属性，
//						extra.populate 指定哪个属性要级联查询http://mongoosejs.com/docs/populate.html
const getPagedReuslt = function(_query, _index, _orderBy, _size, _extra) {
	const model = this;

	const query = _query || {};
	const index = _index || 1;
	const size = _size || 10;
	const orderBy = _orderBy || { includeTime: -1 };
	const extra = _extra || {};

	//获取总数
	const getCount = function() {
		return model.count(query).exec();
	};

	//获取分页的列表
	const getList = function() {
		const listQuery = model
			.find(query)
			.skip((index - 1) * size)
			.limit(size);

		if (extra.select) {
			listQuery = listQuery.select(extra.select);
		}

		if (extra.populate) {
			listQuery = listQuery.populate(extra.populate);
		}

		return listQuery.sort(orderBy).lean().exec();
	};

	/**
	 * 封装pagedresult对象
	 * @param  int index       当前页码
	 * @param  int size        每页显示的记录数
	 * @param  int pageCount   页码总数
	 * @param  int recordCount 记录总数
	 * @param  [object] list   记录列表
	 * @return object          pagedresult对象
	 */
	const wrapPagedResult = function(index, size, pageCount, recordCount, list) {
		return {
			pageIndex: Number(index),
			pageSize: Number(size),
			pageCount: Number(pageCount),
			recordCount: Number(recordCount),
			hasMore: index != pageCount,
			list: list
		};
	};

	return join(getCount(), getList(), function(count, list) {
		const pageCount = Math.ceil(count / size);
		return wrapPagedResult(index, size, pageCount, count, list);
	});
};

module.exports = function(schema) {
	//扩展获取分页数据的方法
	schema.statics.getPagedReuslt = getPagedReuslt;
};