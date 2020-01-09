import React from 'react';
import {StyleSheet, View, Text} from "react-native";

import CameraScreenMain from "./components/CameraScreenMain.jsx";
import MainMenu from "./components/MainMenu.jsx";
import MockApp from './components/Mockapp.jsx';

export default class App extends React.Component {

	constructor(props){
		super(props);

		this.appletts = {
			"MainMenu": <MainMenu />,
			"BarcodeReader": <CameraScreenMain />
		};
		this.currently_rendering = this.appletts["MainMenu"];
		this.change_to_camera = this.change_to_camera.bind(this);
		this.change_to_menu = this.change_to_menu.bind(this);
	}

	change_to_camera() {
		this.currently_rendering = this.appletts["BarcodeReader"];
	}

	change_to_menu() {
		this.currently_rendering = this.appletts["MainMenu"];
	}

	render() {
		return (
			<MainMenu />
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
		flex: 5
	}
});
