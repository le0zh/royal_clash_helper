import React, { View, ScrollView, Text, StyleSheet } from 'react-native'
import JPush, { JpushEventReceiveMessage, JpushEventOpenMessage } from 'react-native-jpush'

export default class JpushDemo extends React.Component {
	componentDidMount() {
		// JPush.requestPermissions()
		this.pushlisteners = [
			JPush.addEventListener(JpushEventReceiveMessage, this.onReceiveMessage.bind(this)),
			JPush.addEventListener(JpushEventOpenMessage, this.onOpenMessage.bind(this)),
		]
	}

	componentWillUnmount() {
		this.pushlisteners.forEach(listener => {
			JPush.removeEventListener(listener);
		});
	}
	onReceiveMessage(message) {
		console.log('onReceiveMessage', message);
	}
	onOpenMessage(message) {
		console.log('onOpenMessage', message);
	}

	render() {
		return (
			<View>
				<Text>hello jpush</Text>
			</View>
		);
	}
}