import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


class Content extends React.Component{
	render() {
		return (
			<View style={styles.content}>
				<Text style={styles.content_text}>This is the content!This is the content!This is the content!
					This is the content!This is the content!This is the content!
					This is the content!This is the content!This is the content!
					This is the content!This is the content!This is the content!
					This is the content!This is the content!This is the content!
					This is the content!This is the content!This is the content!
					This is the content!This is the content!This is the content!</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	content : {
		backgroundColor: 'powderblue',
		flex: 5,
	},
	content_text : {
		textAlign: "center"
	}
});

export default Content;