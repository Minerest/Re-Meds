import React from 'react';
import {StyleSheet} from "react-native";
import * as SQLite from 'expo-sqlite';

import CameraScreenMain from "./components/CameraScreenMain.jsx";
import MainMenu from "./components/MainMenu.jsx";
import DrugMenu from './components/DrugMenu.jsx';



export default class App extends React.Component {

	constructor(props){
		super(props);
		this.db = SQLite.openDatabase("drugs.db");
		this.state = {
			appletts : {
				"MainMenu": <MainMenu goto_drugs={() => this.goto_drugs()} cam={() => this.change_to_camera()}/>,
				"BarcodeReader": <CameraScreenMain
					check_upc_data={(data) => this.check_upc_data(data)} menu={() => this.change_to_menu()}/>
			},
			currently_rendering: <MainMenu goto_drugs={() => this.goto_drugs()} cam={() => this.change_to_camera()}/>,
			data: []
		};
		this.change_to_camera = this.change_to_camera.bind(this);
		this.change_to_menu = this.change_to_menu.bind(this);
		this.check_upc_data = this.check_upc_data.bind(this);
		this.goto_drugs = this.goto_drugs.bind(this);
	}

	componentDidMount() {
		this.db.transaction(tx => {
			tx.executeSql(
				"create table if not exists drugs (id integer primary key not null, " +
				"brand_name string, manufacturer_name string, do_not_use string, stop_use string," +
				"dosage_and_administration string, product_type string, purpose string;"
			);
			tx.executeSql(
				"create table if not exists drug_ingredients (id integer primary key not null, " +
				"active_ingredient string, drug_id integer references drugs(drugs.id);"
			);
			console.log("DB CREATION SUCCESS");
		})
	}

	goto_drugs(){
		this.setState({
			currently_rendering: <DrugMenu drugs={this.state.data} menu={this.change_to_menu}/>
		});
	}

	add_data_to_database(data){
		console.log(data);
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
			this.add_data_to_database(data);
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
