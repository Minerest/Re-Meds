import React from 'react';
import { Text, View, StyleSheet } from 'react-native';


class SideBar extends React.Component {

	render(){
		return (
			<View style={styles.sidebar}>
				<Text style={styles.sidebar_option}
				onTouchStart={this.props.cam}>
					Camera
				</Text>
				<Text style={styles.sidebar_option}>
					About Me
				</Text>
				<Text onTouchStart={this.props.goto_searchbar} style={styles.sidebar_option}>
					Search
				</Text>
				<Text style={styles.sidebar_option} onTouchStart={this.props.goto_interactions}>
					Drug Interactions
				</Text>
				<Text style={styles.sidebar_option} onTouchStart={this.props.goto_drugs}>
					Drugs
				</Text>
			</View>
		)
	};
}

let styles = StyleSheet.create({
	sidebar : {
		flex: 3,
		backgroundColor: "black",
		flexDirection: "column",
		paddingRight: 10,

	},
	sidebar_option : {
		backgroundColor: "yellow",
		marginTop: 40,
		marginLeft: 10,
		textAlign: "center",
		flex: 1,
		overflow: "hidden",
		borderRadius: 10,
	}
});
export default SideBar;
