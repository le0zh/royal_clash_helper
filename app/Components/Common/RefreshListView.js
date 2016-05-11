/**
 * 通用的下拉刷新，无限加载组件
 */

import React, {
	ListView,
	View,
	Text,
	Navigator,
	PullToRefreshViewAndroid,
	ProgressBarAndroid,
	StyleSheet,
	TouchableOpacity,
}
from 'react-native'
import CommonComponents from '../Common/CommonComponents'
import ErrorPlaceholder from '../Common/ErrorPlaceHolderComponent'
import Platform from 'Platform'
import ApiService from '../../ApiService'

const PropTypes = React.PropTypes;
const LISTVIEWREF = 'listview';
const CONTAINERREF = 'container';

const STATUS_NONE = 0;
const STATUS_INFINITE_IDLE = 4;
const STATUS_INFINITING = 6;

const DEFAULT_PULL_DISTANCE = 50;
const DEFAULT_HF_HEIGHT = 40;

const RefreshListView = React.createClass({
	_dataSource: [],
	_page: 1,
	_maxPage: -1,
	_loading: false,
	_loaded: false,
	_loadPath: null,

	propTypes: {
		enablePullToRefresh: PropTypes.bool,
		/**
		 * return a reloadPromise path
		 */
		reloadPromisePath: PropTypes.func,
		/**
		 * return an array of handled data, (value) => {}
		 */
		handleReloadData: PropTypes.func,
		/**
		 * render the row, like ListView
		 */
		renderRow: PropTypes.func,
		/**
		 * context object
		 */
		context: PropTypes.func,
		/**
		 * Error holder (error) => {}
		 */
		renderErrorPlaceholder: PropTypes.func,
		/**
		 * Max page for a list
		 */
		maxPage: PropTypes.number,
	},

	getInitialState() {
		this._maxPage = this.props.maxPage || -1;
		this._loaded = false;

		const dataSourceParam = {
			rowHasChanged: (row1, row2) => row1 !== row2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		}

		return {
			dataSource: new ListView.DataSource(dataSourceParam),
			loaded: true,
			lastError: {
				isReloadError: false,
				error: null
			},
			isRefreshing: false,
			status: STATUS_INFINITE_IDLE
		};
	},

	/**
	 * 组件加载完成后，读取数据
	 */
	componentDidMount() {
		this.reloadData();
	},

	/**
	 * 当需要的时候再加载数据
	 */
	reloadDataIfNeed() {
		const pathChanged = this._loadPath != this.props.reloadPromisePath();
		if (this._dataSource.length == 0 || pathChanged) {
			this.reloadData();
		}
	},

	/**
	 * 清空数据和相关属性
	 */
	clearData() {
		this._dataSource = [];
		this._setNeedsRenderList([]);
		this._page = 1;
		this._maxPage = 1;
		this._loading = false;
	},

	/**
	 * 在请求路径上添加页码参数
	 */
	_pageString(path) {
		const testReg = /\w+[?]\w+/;
		if (testReg.test(path)) {
			path += '&page=' + this._page;
		} else {
			path += '?page=' + this._page;
		}

		//上面的方法是在queryString中添加分页信息的方式
		//下面的方法是在路由上配置过之后，在url中添加分页信息

		// path += '/' + this._page;

		return path;
	},

	/**
	 * 加载数据
	 */
	reloadData() {
		let path = this.props.reloadPromisePath();
		this._loadPath = path;

		if (!path || this._loading) return;

		//准备开始加载，设置state
		this._loading = true;
		this.setState({
			lastError: {
				isReloadError: false,
				error: null
			},
			loaded: this.state.dataSource.getRowCount() > 0,
			isRefreshing: true,
		});
		this._dataSource = [];
		this._page = 1;

		path = this._pageString(path);

		console.log(path);

		const reloadPromise = ApiService.fetchPromise(path);
		fetch(path)
			.then(value => {
				//认证失败
				// if (value.status > 400) {
				// 	//TODO: 跳转到错误提示页面，或者如果需要登录的话，跳转到登录页面
				// 	// this.props.navigator.push({
				// 	// 	id: 'login',
				// 	// 	title: 'API need login',
				// 	// 	sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
				// 	// });
				// }

				console.log(value);

				//调用处理函数，对返回值进行处理
				const rdata = this.props.handleReloadData(value);

				console.log(rdata);

				this._maxPage = rdata.pageCount;

				//使用下面的函数对数据进行渲染
				this._setNeedsRenderList(rdata.list);

				if (this._dataSource.length == 0) {
					throw new Error('Not Found');
				}
			})
			.catch(err => {
				console.log(err);

				const pError = {
					loaded: true,
					lastError: {
						isReloadError: true,
						error: err
					},
				};

				//如果指定了错误处理函数，则调用之
				this.props.handleError && this.props.handleError(pError);
				this.setState(pError);
			})
			.done(() => {
				//拿到listview的引用
				//const node = this.refs[LISTVIEWREF];

				console.log('refresh done');

				this._loading = false;
				this.setState({
					isRefreshing: false
				})
			});
	},

	/**
	 * 加载更多
	 */
	appendPage() {
		if (this._page > this._maxPage) {
			return;
		}

		this._page++;

		let path = this.props.reloadPromisePath();
		if (!path) return;

		//显示加载中
		this.setState({
			status: STATUS_INFINITING
		});

		path = this._pageString(path);
		console.log('appendPage path', path);

		const appendPromise = ApiService.fetchPromise(path);

		appendPromise
			.then(value => {
				const rdata = this.props.handleReloadData(value);
				this._setNeedsRenderList(rdata.list);
			})
			.catch(err => {
				this.showError(err);

				const pError = {
					loaded: true,
					lastError: {
						isReloadError: false, //不是刷新过程中遇到的问题，是加载更多时遇到的问题
						error: err
					},
				};

				this.setState(pError);
				this._page--; //遇到了错误，回滚页码

				//如果指定了错误处理函数，则调用
				this.props.handleError && this.props.handleError(pError);
			})
			.done(() => {
				this.setState({
					status: STATUS_INFINITE_IDLE
				});
			});
	},

	_setNeedsRenderList(rdata) {
		this._dataSource.push(...rdata);

		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(this._dataSource),
			loaded: true,
			isRefreshing: false //TODO 不知道为什么第一次reloaddata请求了两次
		});
	},

	componentDidUpdate(prevProps, prevState) {
		//下面这是针对ios的调整
		// let node = this.refs[LISTVIEWREF];
		// if (!node || !this.props.enablePullToRefresh) return;

		// DXRefreshControl.configureCustom(node, {
		// 	headerViewClass: 'UIRefreshControl',
		// }, this.reloadData);
	},

	//list中row的间隔
	renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		return (
			<View key= {'SEP_' + sectionID + '_' +rowID} style={{height: 1, backgroundColor: '#eee'}}></View>
		);
	},

	renderFooterInifiteIdle() {
		return (
			<View style={styles.appendLoading}>
				<Text>加载更多...</Text>
			</View>
		);
	},

	renderHeaderRefreshing() {
		if (Platform.OS === 'android') {
			return (
				<View style={styles.appendLoading}>
					<ProgressBarAndroid styleAttr="Small"/>
				</View>
			);
		} else if (Platform.OS === 'ios') {
			return (
				<View style={styles.appendLoading}>
					<ActivityIndicatorIOS size='small'/>
				</View>
			);
		}
	},

	/**
	 * 点击加载更多的视图
	 */
	clickToLoadMore() {
		return (
			<View style={{flex:1, height: 40, alignItems: 'center'}}>
				<TouchableOpacity onPress={this.appendPage}>
					<Text>
						点击加载更多...
					</Text>
				</TouchableOpacity>
			</View>
		);
	},

	/**
	 * 列表视图foot的视图
	 */
	renderFooter() {
		var status = this.state.status;

		if (status == STATUS_INFINITE_IDLE) {
			//return this.renderFooterInifiteIdle();
			return this.clickToLoadMore();
		}

		if (status == STATUS_INFINITING) {
			return this.renderHeaderRefreshing();
		}

		return null;
	},

	render() {
		if (!this.state.loaded) {
			//显示加载中
			return CommonComponents.renderLoadingView();
		}

		//如果是刷新错误，则显示错误提示
		if (this.state.lastError.isReloadError) {
			const error = this.state.lastError.error;

			if (this.props.renderErrorPlaceholder) {
				return this.props.renderErrorPlaceholder(error);
			} else {
				return (
					<ErrorPlaceholder
			            title={error.message}
			            desc={'加载失败，请重试'}
			            onPress={this.reloadData} />
				);
			}
		}

		//这里针对两个平台分别调用不同的组件，达到refreshListView的统一
		if (Platform.OS === 'android') {
			return (
				<PullToRefreshViewAndroid
					style={[{flex: 1}, this.props.style]}
					refreshing={this.state.isRefreshing}
					onRefresh={this.reloadData}
					>
					<ListView
			            dataSource={this.state.dataSource}
			            renderSeparator = {this.renderSeparator}
			            renderRow={this.props.renderRow}
			            renderFooter={this.renderFooter}
			            {...this.props}
			            style={{flex: 1}} >
			          </ListView>
				</PullToRefreshViewAndroid>
			);
		} else if (Platform.OS === 'ios') {
			//TODO: 暂时还没有兼容ios平台
			throw new Error('RefreshListView 暂时还没有兼容ios平台');
		}
	}
});

var styles = StyleSheet.create({
	appendLoading: {
		flex: 1,
		alignItems: 'center',
		height: 40,
		justifyContent: 'center'
	}
});

module.exports = RefreshListView;