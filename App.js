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
		this.get_drugs = this.get_drugs.bind(this);
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

	async goto_drugs(){

		let drugs = await this.get_drugs();
		this.setState({
			currently_rendering: <DrugMenu drugs={drugs} menu={this.change_to_menu}/>
		});
	}

	add_data_to_database(data){
		// I have to do this because the FDA assumes EVERYTHING is an array.
		let brand_name = data.openfda.brand_name ? data.openfda.brand_name[0] : null;
		let manf_name = data.openfda.manufacturer_name ? data.openfda.manufacturer_name[0] : null;
		let dnu = data.do_not_use ? data.do_not_use[0] : null;
		let stop_use = data.stop_use ? data.stop_use[0] : null;
		let d_and_a = data.dosage_and_administration ? data.dosage_and_administration[0] : null;
		let product_type = data.openfda.product_type ? data.openfda.product_type[0] : null;
		let purpose = data.purpose ? data.purpose[0] : null;
		let upc = data.openfda.upc ? data.openfda.upc[0] : null;

		this.db.transaction(tx => {
			tx.executeSql("insert into drugs (brand_name, manufacturer_name, do_not_use, stop_use," +
				"dosage_and_administration, product_type, purpose, upc) values(?, ?, ?, ?, ?, ?, ?, ?)",
				[brand_name, manf_name, dnu, stop_use, d_and_a, product_type, purpose, upc],
				() =>console.log("SUCCESS"),
				(t) => console.log(t));
		})

	}

	toggle_upc_found1(){
		console.log("TOGGLE", this.upc_found);
		this.upc_found = !this.upc_found;
	}

	toggle_upc_found(){
		this.upc_found = false;
	}

	async check_db_for_upc(upc){
			let p = new Promise((resolve, reject)=> {
				console.log("INNER P");
				this.db.transaction(tx => {
					tx.executeSql("select * from drugs where upc = (?);", [upc],
						(tx, res) => {
							console.log("RESULT ROWS UPC CHECK", res.rows.length);
							if (res.rows.length > 0) {
								this.upc_found = true;
							}
							resolve(this.upc_found);
						},
						(tx, err) => console.log(tx, err));
				});
				console.log("CHECK DB FOR UPC", this.upc_found);
			});
			return p;
	}

	store_drug(data){
		// console.log(data.results[0].openfda.upc[0]);
		this.add_data_to_database(data.results[0]);
	}

	async get_drugs(){
		return new Promise((resolve, reject) => {
			this.db.transaction(tx => {
				tx.executeSql("select * from drugs;", null,
					(tx, res) => {
					console.log("RESULTS", res);
					resolve(res.rows);
					}, (tx, err) => console.log(tx, err));
			})

		})
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
