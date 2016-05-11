import Platform from 'Platform'
import cssVar from 'cssVar'
import Icon from 'react-native-vector-icons/Ionicons'
import NavigatorNavigationBarStyle from './NavigatorBarStyle.android'

import React, {
	Navigator,
	TouchableOpacity,
	StyleSheet,
	PixelRatio,
	Text,
	TextInput,
	View,
	BackAndroid,
	Picker
}
from 'react-native'

import Colors from './Common/Colors'
import LogList from './NewsList/NewsListComponent'

const Dimensions = require('Dimensions');
const ScreenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
	navBar: {
		backgroundColor: 'white',
		borderBottomColor: Colors.borderColor,
		borderBottomWidth: 0.5,
	},
	navBarText: {
		fontSize: 16,
		marginVertical: 10,
	},
	navBarTitleText: {
		color: cssVar('fbui-bluegray-60'),
		fontWeight: '500',
		marginVertical: 15,
	},
	navBarLeftButton: {
		paddingLeft: 10,
		width: 40,
		height: 40,
	},
	navBarRightButton: {
		paddingRight: 10,
	},
	searchIcon: {
		marginLeft: 3,
		marginRight: 3,
		width: 20,
		height: 20
	},
	searchBar: {
		padding: 1,
		flexDirection: 'row',
		alignItems: 'center',
		width: ScreenWidth - 10,
		height: 35,
		// borderWidth: 1,
		// borderColor: Colors.borderColor,
		borderRadius: 4,
		margin: 5,
		backgroundColor: Colors.backGray,
	},
	textInput: {
		fontSize: 14,
		alignSelf: 'stretch',
		flex: 1,
		color: Colors.black,
	},
	filterBar: {
		padding: 1,
		flexDirection: 'row',
		alignItems: 'center',
		width: ScreenWidth - 10,
		height: 35,
		// borderWidth: 1,
		// borderColor: Colors.borderColor,
		borderRadius: 4,
		margin: 5,
	},
	filter: {
		flex: 1,
		color: Colors.black,
	},
	filterIcon: {
		marginLeft: 3,
		marginRight: 0,
		width: 20,
		height: 20
	}
});

let logFilter = 'all';

// const NavigationBarRouteMapper = {
// 	name: '',

// 	onSubSystemChange(newVal) {
// 		logFilter = newVal;
// 		alert(newVal);
// 		//this.refs.RefreshListView.reloadData();
// 	},

// 	LeftButton: function(route, navigator, index, navState) {
// 		if (index === 0) {
// 			return null;
// 		}

// 		//返回按钮
// 		return (
// 			<TouchableOpacity
// 				onPress={()=>navigator.pop()}
// 				style={styles.navBarLeftButton}
// 				>
// 				<Icon
// 					name='ios-arrow-back'
// 					size={30}
// 					style={{marginTop: 8}}
// 					color={Colors.blue}
// 					>
// 				</Icon>
// 			</TouchableOpacity>
// 		);
// 	},

// 	RightButton: function(route, navigator, index, navState) {
// 		// body...
// 	},

// 	Title: function(route, navigator, index, navState) {
// 		let title;
// 		switch (route.id) {
// 			case 'logList':
// 				title = '日志列表';
// 				break;
// 			case 'logDetail':
// 				title = '日志详情';
// 				break;
// 			default:
// 				title = '';
// 				break;
// 		}

// 		//这里可以根据不同的页面，做不同的调整
// 		//比如搜索等
// 		if (route.id === 'logList') {
// 			return (
// 				<View style={[styles.filterBar, {justifyContent: 'center'}]}>
// 					<Icon
// 			            name={'clipboard'}
// 			            size={20}
// 			            style={styles.filterIcon}
// 			            color={Colors.black}
// 			         />
// 			        <SubSystemSelectComponent 
// 			        	onSelectSubSystem={this.onSubSystemChange}
// 			        	style={styles.filter}></SubSystemSelectComponent>
// 				</View>
// 			);
// 		}

// 		return (
// 			<Text style={[styles.navBarText, styles.navBarTitleText, {width: 250, height: 40, textAlign: 'center'}]}
// 			 	numberOfLines={1}
// 			 	>
// 			 	{title}
// 			</Text>
// 		);
// 	}
// };

const Routes = React.createClass({
	/**
	 * 配置导航条的左侧按钮，标题和右侧按钮
	 */
	NavigationBarRouteMapper: {
		// 导航栏左侧按钮
		LeftButton: function(route, navigator, index, navState) {
			if (index === 0) {
				return null;
			}

			//返回按钮
			return (
				<TouchableOpacity
				onPress={()=>navigator.pop()}
				style={styles.navBarLeftButton}
				>
				<Icon
					name='ios-arrow-back'
					size={30}
					style={{marginTop: 8}}
					color={Colors.blue}
					>
				</Icon>
			</TouchableOpacity>
			);
		},

		// 导航栏右侧按钮
		RightButton: function(route, navigator, index, navState) {
			// body...
		},

		// 导航栏标题
		Title: function(route, navigator, index, navState) {
			let title;
			switch (route.id) {
				case 'logList':
					title = '日志列表';
					break;
				case 'logDetail':
					title = '日志详情';
					break;
				default:
					title = '';
					break;
			}

			//这里可以根据不同的页面，做不同的调整
			//比如搜索等
			// if (route.id === 'logList') {
			// 	return (
			// 		<View style={[styles.filterBar, {justifyContent: 'center'}]}>
			// 		<Icon
			//             name={'clipboard'}
			//             size={20}
			//             style={styles.filterIcon}
			//             color={Colors.black}
			//          />
			//         <SubSystemSelectComponent 
			//         	onSelectSubSystem={route.onSubSystemChange}
			//         	style={styles.filter}></SubSystemSelectComponent>
			// 	</View>
			// 	);
			// }

			return (
				<Text style={[styles.navBarText, styles.navBarTitleText, {width: 250, height: 40, textAlign: 'center'}]}
			 				numberOfLines={1}
							>
			 		{title}
				</Text>
			);
		}
	},

	getInitialState() {
		return ({
			filter: 'all'
		});
	},

	/**
	 * 配置场景切换的方式
	 * @param  {[type]} route [description]
	 * @return {[type]}       [description]
	 */
	configureScene(route) {
		if (route.sceneConfig) {
			return route.sceneConfig;
		}

		return Navigator.SceneConfigs.FloatFromRight;
	},

	/**
	 * 根据初始路由，返回Navigator
	 * @param  {string} initalRoute 初始路由
	 * @return {[type]}             [description]
	 */
	render() {
		const navigationBar = <Navigator.NavigationBar
			routeMapper={this.NavigationBarRouteMapper}
			style={styles.navBar}
			navigationStyles={NavigatorNavigationBarStyle}
		/>;

		return (
			<Navigator
				initialRoute={{id: this.props.initialRoute}}
				renderScene={this.renderScene}
				navigationBar = {navigationBar}
				configureScene={this.configureScene}
				>
			</Navigator>
		);
	},

	/**
	 * 具体的渲染页面的方法
	 */
	renderScene(route, navigator) {
		BackAndroid.addEventListener('hardwareBackPress', () => {
			if (navigator && navigator.getCurrentRoutes().length > 1) {
				navigator.pop();
				return true;
			}
			return false;
		});

		switch (route.id) {
			case 'logList':
				return <LogList navigator={navigator}  route={route} />;
		}

		return null;
	},
});

module.exports = Routes;