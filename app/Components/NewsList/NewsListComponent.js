import Platform from 'Platform'
import React, {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
}
from 'react-native'

import RefreshListView from '../Common/RefreshListView'
import ApiService from '../../ApiService'
import LogCell from './NewsListCell'

export default class NewsListComponent extends React.Component {
	constructor() {
		super();

		this.renderRow = this.renderRow.bind(this);
	}

	handleReloadData(response) {
		const body = response._bodyInit;
		const jsonResult = JSON.parse(body);

		return jsonResult;
	}

	reloadPath() {
		var base = ApiService.apiPath();
		return `${base}/news`;
		// return `${base}/logs/all`;
	}

	renderRow(rowData, sectionID, rowID, highlightRow) {
		console.log('render row', rowData.id);

		return (
			<LogCell key={rowData.id} rowData = {rowData} navigator={this.props.navigator}/>
		);
	}

	componentWillMount() {

	}

	componentWillReceiveProps() {
		alert('aaa');
		alert(this.props.filter);
	}

	render() {
		return (
			<View style={{backgroundColor: '#fff', flex: 1, paddingTop:40}}>
				<RefreshListView
					style={{flex: 1}}
					enablePullToRefresh={true}
					renderRow={this.renderRow}
					reloadPromisePath={this.reloadPath}
					handleReloadData={this.handleReloadData}
					navigator={this.props.navigator}
					maxPage={10}
					contentInset={{top: 0, left: 0, bottom: 0, right: 0}}
					contentOffset={{x:0, y: 0}}>
				</RefreshListView>
			</View>
		);
	}
}