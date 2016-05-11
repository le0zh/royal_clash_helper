const React = require('react-native');
const Colors = require('./Colors');

const {
	StyleSheet,
	View,
	ActivityIndicatorIOS,
	Text,
	TouchableOpacity,
} = React;

const ErrorPlaceholder = React.createClass({
	propTypes: {
		title: React.PropTypes.string, //错误信息标题
		desc: React.PropTypes.string, //错误信息描述
		onPress: React.PropTypes.func, //处理按钮的函数
	},

	render() {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorTextTitle}>
					{this.props.title}
				</Text>
				<Text style={styles.errorText}>
					{this.props.desc}
				</Text>
				<TouchableOpacity style={styles.reloadText} onPress={this.props.onPress}>
					<Text style={styles.errorText}>
						重新加载
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.8)',
	},
	errorText: {
		fontSize: 14,
		textAlign: 'center',
		marginBottom: 2,
	},
	errorTextTitle: {
		fontSize: 15,
		fontWeight: '500',
		marginBottom: 10,
	},
	reloadText: {
		borderColor: '#eee',
		borderWidth: 1,
		borderRadius: 3,
		marginTop: 20,
		padding: 2,
	},
});

module.exports = ErrorPlaceholder;