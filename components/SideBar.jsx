import React from 'react';
import { Text, View, StyleSheet } from 'react-native';


class SideBar extends React.Component {

	render(){
		return (
			<View style={styles.sidebar}>
				<Text style={styles.sidebar_option}
				onTouchStart={this.props.cam}>Camera</Text>
				<Text style={styles.sidebar_option}>About Me </Text>
				<Text style={styles.sidebar_option}>Purpose</Text>
				<Text style={styles.sidebar_option}>Drugs And Interactions</Text>
			</View>
		)
	};
}

let styles = StyleSheet.create({
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
	}
});
export default SideBar;
