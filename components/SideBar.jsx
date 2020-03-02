import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Camera_icon from './../assets/camera_icon.png';
import {Image} from 'react-native'

class SideBar extends React.Component {
	// creates the side bar buttons on the side.
	render(){
		return (
			<View style={styles.sidebar}>
				<View style={[styles.sidebar_option, {marginTop:0}]}>
					<Text style={{marginLeft:"auto", marginRight:"auto"}}
					onTouchStart={this.props.cam}>
						Camera

					</Text>
					<Image source={Camera_icon} style={{marginLeft:"auto", marginRight:"auto", borderRadius: 15, marginTop:10}}/>
				</View>
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
