import React from 'react';
import {StyleSheet, Text, View} from 'react-native';


class MockApp extends React.Component {


	render(){
		return(
			<View style={style.container}>
				<View style={style.sidebar}>
					<Text style={style.sidebar_option}>Camera</Text>
					<Text onTouchStart={this.change_to_camera} style={style.sidebar_option}>About Me </Text>
					<Text style={style.sidebar_option}>Purpose</Text>
				</View>
				<View style={style.content}>
					<Text style={style.content_text}>This is the content!This is the content!This is the content!
						This is the content!This is the content!This is the content!
						This is the content!This is the content!This is the content!
						This is the content!This is the content!This is the content!
						This is the content!This is the content!This is the content!
						This is the content!This is the content!This is the content!
						This is the content!This is the content!This is the content!</Text>
				</View>
			</View>
		)
	}
}

const style = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "blue",
		flexDirection: "row"
	},
	sidebar : {
		flex: 1,
		backgroundColor: "black",
		flexDirection: "column"
	},

	sidebar_option : {
		backgroundColor: "yellow",
		marginTop: 40,
		textAlign: "center",
		flex: 1
	},
	content : {
		backgroundColor: 'powderblue',
		flex: 5,
	},
	content_text : {
		textAlign: "center",
	}
});

export default MockApp;
