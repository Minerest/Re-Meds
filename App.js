import React from 'react';
import * as SQLite from 'expo-sqlite';

import CameraScreenMain from "./components/CameraScreenMain.jsx";
import MainMenu from "./components/MainMenu.jsx";
import DrugMenu from './components/DrugMenu.jsx';



export default class App extends React.Component {

	constructor(props){
		super(props);
		this.db = SQLite.openDatabase("drugs.db");
		this.db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false,
			() =>
			console.log('Foreign keys turned on')
		);
		this.state = {
			appletts : {
				"MainMenu": <MainMenu goto_drugs={() => this.goto_drugs()} cam={() => this.change_to_camera()}/>,
				"BarcodeReader": <CameraScreenMain
					store_drug={(data) => this.store_drug(data)} menu={() => this.change_to_menu()}
					check_db_for_upc={(upc) => this.check_db_for_upc(upc)}
					toggle_upc={() => this.toggle_upc_found()}/>
			},
			currently_rendering: <MainMenu goto_drugs={() => this.goto_drugs()} cam={() => this.change_to_camera()}/>,
			data: []
		};
		this.upc_found = false;
		this.change_to_camera = this.change_to_camera.bind(this);
		this.change_to_menu = this.change_to_menu.bind(this);
		this.store_drug = this.store_drug.bind(this);
		this.goto_drugs = this.goto_drugs.bind(this);
		this.check_db_for_upc = this.check_db_for_upc.bind(this);
	}

	componentDidMount() {
		console.log('mount');
		this.db.transaction(tx => {
			// tx.executeSql("drop table drugs");

			tx.executeSql("drop table drugs");
			tx.executeSql(
				"create table if not exists drugs (id integer primary key not null, " +
				"brand_name string, manufacturer_name string, do_not_use string, stop_use string," +
				"dosage_and_administration string, product_type string, purpose string, upc string);"
			,[], () => console.log("db success"), (t, err) => console.log(t, err));
			tx.executeSql(
				"create table if not exists drug_ingredients (id integer primary key not null, " +
				"active_ingredient string, drug_id integer references drugs(id));", [],
				() => console.log("ing success"), (t, err) => console.log(t, err));
		})
	}

	goto_drugs(){
		this.setState({
			currently_rendering: <DrugMenu drugs={this.state.data} menu={this.change_to_menu}/>
		});
	}

	add_data_to_database(data){
		// console.log(data);
		this.db.transaction(tx => {
			tx.executeSql("insert into drugs (brand_name, manufacturer_name, do_not_use, stop_use," +
				"dosage_and_administration, product_type, purpose, upc) values(?, ?, ?, ?, ?, ?, ?, ?)",
				[data.openfda.brand_name, data.openfda.manufacturer_name, data.do_not_use, data.stop_use,
					data.dosage_and_administration, data.openfda.product_type, data.purpose, data.openfda.upc[0]], (s) => console.log("Success"),
				(t, err) => console.log(t, err));
		});
		this.db.transaction(tx => {
				tx.executeSql("select * from drugs", [],
					(_, result) => {
						console.log(result.rows, _);
					}, (err) => console.log("select fail" + err)
				)
			}
		)
	}

	toggle_upc_found(){
		this.upc_found = !this.upc_found;
	}

	async check_db_for_upc(upc){
		return new Promise((resolve, reject) => {

			let p = new Promise((resolve, reject)=> {
				console.log("INNER P");
				this.db.transaction(tx => {
					tx.executeSql("select * from drugs where upc = ?", upc,
						(tx, result) => {
							console.log("QUERY", result.rows);
							if (result.rows !== 0) {
								console.log("UPC FOUND!");
								this.toggle_upc_found();
							} else {
								console.log("UPC NOT FOUND:!:!@:#!@#$%");
							}
							console.log("THIS.UPC FOUND", this.upc_found);

						},
						(tx, err) => console.log(tx, err));
				});
				console.log("Resolveing??", this.upc_found);
				resolve(this.upc_found);
			});
			console.log("Returning from async", p);
			resolve(p);
		})
	}

	store_drug(data){
		// console.log(data.results[0].openfda.upc[0]);
		this.state.data.push(data);
		this.add_data_to_database(data.results[0]);
		console.log("ADDED UPC DATA");
		this.toggle_upc_found();
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
