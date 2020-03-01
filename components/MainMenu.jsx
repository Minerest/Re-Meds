import React from 'react';
import { Text, View, StyleSheet } from "react-native";

import SideBar from './SideBar.jsx';
import Content from './Content.jsx';


class MainMenu extends React.Component {
	constructor(props){
		super(props);
		this.sidebar_state = true;
	}

	render(){
		return(
			<View style={{flex:1}}>
				<Text style={stylez.Header}>RE:Meds</Text>
				<View style={stylez.Container}>
					<SideBar goto_interactions={this.props.goto_interactions}
							 goto_searchbar={this.props.goto_searchbar}
							 cam={this.props.cam} goto_drugs={this.props.goto_drugs} active={this.sidebar_state} />
					<Content />
				</View>
			</View>
		)
	}
}

const stylez = StyleSheet.create({
	Container: {
		flex: 1,
		backgroundColor: "blue",
		flexDirection: "row"
	},
	Header: {
		fontSize: 40,
		fontWeight: "bold",
		textAlign: "center",
		paddingTop: 20,
	}
});

export default MainMenu;
