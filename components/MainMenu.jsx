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
			<View style={stylez.Container}>
				<SideBar active={this.sidebar_state} />
				<Content />
			</View>
		)
	}
}

const stylez = StyleSheet.create({
	Container: {
		flex: 1,
		backgroundColor: "blue",
		flexDirection: "row"
	}
});

export default MainMenu;
