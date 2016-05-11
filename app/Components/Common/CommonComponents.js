const React = require('react-native');
const Colors = require('./Colors');
const CommonStyles = require('./CommonStyle');
const Platform = require('Platform');

const {
	StyleSheet,
	View,
	ActivityIndicatorIOS,
	Text,
	ProgressBarAndroid,
} = React;

/**
 * 通用、公用的组件
 */
export default class CommonComponents {
	/**
	 * 展示加载中视图
	 */
	static renderLoadingView() {
		if (Platform.OS === 'android') {
			return (
				<View style={CommonStyles.container}>
		          <ProgressBarAndroid styleAttr="Inverse"/>
		        </View>
			)
		} else if (Platform.OS === 'ios') {
			return (
				<View style={CommonStyles.container}>
		          <ActivityIndicatorIOS size="large" />
		        </View>
			);
		}
	}

	/**
	 * 展示分割线
	 */
	static renderSepLine() {
		return (
			<View style={CommonStyles.sepLine}>
      		</View>
		)
	}
}