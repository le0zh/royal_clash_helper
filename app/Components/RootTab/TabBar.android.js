import React, {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Animated
}
from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../Common/Colors'

var styles = StyleSheet.create({
	tab: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	tabItem: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	tabs: {
		height: 49,
		flexDirection: 'row',
		paddingTop: 5,
		borderTopWidth: 0.5,
		borderTopColor: Colors.backGray,
	}
});

const FacebookTabBar = React.createClass({

	propTypes: {
		goToPage: React.PropTypes.func,
		activeTab: React.PropTypes.number,
		tabs: React.PropTypes.array
	},

	renderTabOption(name, page) {
		var isTabActive = this.props.activeTab === page;
		const color = isTabActive ? Colors.blue : Colors.textGray
		const tabName = name.tabName;
		const iconName = name.iconName;

		return (
			<TouchableOpacity
				key={tabName}
				onPress={() => this.props.goToPage(page)}
				style={styles.tab}>
				<View
					style={styles.tabItem}
					>
						<Icon name={iconName} color={color} size={20}/>
						<Text style={[styles.icon, {color: color}]}>
							{tabName}
						</Text>
				</View>
			</TouchableOpacity>
		);
	},

	render() {
		return (
			<View>
		        <View style={styles.tabs}>
		          {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
		        </View>
	      	</View>
		);
	},
});

module.exports = FacebookTabBar;