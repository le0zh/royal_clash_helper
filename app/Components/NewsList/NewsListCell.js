import React, {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableHighlight,
	TouchableOpacity,
	PropTypes
} from 'react-native';

import Colors from '../Common/Colors';
import CommonComponents from '../Common/CommonComponents';

const styles = StyleSheet.create({
	cellContentView: {
		flexDirection: 'column',
		flex: 1,
		alignItems: 'stretch',
	},

	messageView: {
		margin: 10,
		height: 45,
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		marginBottom: 1,
	},

	textDesContainer: {
		flexDirection: 'row',
		margin: 10,
		justifyContent: 'space-between'
	}
});

export default class NewsListCell extends React.Component {
	constructor() {
		super();

		this.cellAction = this.cellAction.bind(this);
	}

	cellAction() {
		const rowData = this.props.rowData;
		//console.log(rowData.type);
	}

	render() {
		const { rowData } = this.props;

		return (
			<TouchableHighlight underlayColor={'#eee'} onPress={this.cellAction}>
				<View style={styles.cellContentView}>
					<View style={styles.messageView}>
						<Text style={{ color:'#212121', fontSize:12,}}>{rowData.title}</Text>
					</View>
					<View style={styles.textDesContainer}>
						<Text style={{color:'#727272', fontSize:12,}}>{rowData.systemAlias}</Text>
						<Text style={{color:'#727272', fontSize:12,}}>{rowData.time}</Text>
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}

NewsListCell.propTypes = {
	rowData: PropTypes.object
};