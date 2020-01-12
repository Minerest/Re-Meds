import React from 'react';
import {StyleSheet, View, Text} from "react-native";

import CameraScreenMain from "./components/CameraScreenMain.jsx";
import MainMenu from "./components/MainMenu.jsx";
import MockApp from './components/Mockapp.jsx';

export default class App extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			appletts : {
				"MainMenu": <MainMenu cam={() => this.change_to_camera()}/>,
				"BarcodeReader": <CameraScreenMain
					check_upc_data={(data) => this.check_upc_data(data)} menu={() => this.change_to_menu()}/>
			},
			currently_rendering: <MainMenu cam={() => this.change_to_camera()}/>,
			data: []
		};
		this.change_to_camera = this.change_to_camera.bind(this);
		this.change_to_menu = this.change_to_menu.bind(this);
		this.check_upc_data = this.check_upc_data.bind(this);
	}

	check_upc_data(data){
		console.log(data.results[0].openfda.upc[0]);
		let data_found = false;
		for (let i = 0; i < this.state.data.length; i++){
			for (let j = 0; j < data.results[0].openfda.upc.length; j++){
				if (this.state.data[i].results[0].openfda.upc[i] === data.results[0].openfda.upc[j]){
					data_found = true;
				}
			}
		}
		if (!data_found){
			this.state.data.push(data);
			console.log("ADDED UPC DATA");
		}
		else {
			console.log("NOT ADDED UPC");
		}
	}

	change_to_camera() {
		this.setState({currently_rendering: this.state.appletts["BarcodeReader"]})
	}

	change_to_menu() {
		this.setState({currently_rendering: this.state.appletts["MainMenu"]})
	}

	render() {
		return (
			this.state.currently_rendering
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
