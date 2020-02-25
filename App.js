import React from 'react';
import * as SQLite from 'expo-sqlite';

import CameraScreenMain from "./components/CameraScreenMain.jsx";
import MainMenu from "./components/MainMenu.jsx";
import DrugMenu from './components/DrugMenu.jsx';
import {Interactions} from './components/Interactions';
// Drug interactions API. TODO: Use this
// https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=209459

export default class App extends React.Component {
	// The App object basically handles all of the data components.
	// It, by itself, does not render any of the <Text />, however, it chooses which components to render.
	constructor(props){
		// Set up the App object
		super(props);

		// Create database "drugs.db" if it does not exist
		this.db = SQLite.openDatabase("drugs.db");

		// Turn on foreign keys
		this.db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false,
			() =>
			console.log('Foreign keys turned on')
		);

		// Print out the table column names for debugging purposes.
		this.db.exec([{ sql: 'PRAGMA table_info(drugs);', args: [] }], false,
			(t, r) => {
				console.log(r[0].rows.map((x) => {return x.name}));
			}
		);

		// Set the default state. The app rerenders when the state changes.
		this.state = {

			// The 'appletts' that render are stored in this dictionary/object.
			// this.state.appletts["MainMenu"] renders the main menu component.
			appletts : {
				"MainMenu": <MainMenu goto_interactions={()=>this.goto_interactions()}
					goto_drugs={() => this.goto_drugs()} cam={() => this.change_to_camera()}/>,
				"BarcodeReader": <CameraScreenMain
					store_drug={(data) => this.store_drug(data)} menu={() => this.change_to_menu()}
					check_db_for_upc={(upc) => this.check_db_for_upc(upc)}
					toggle_upc={() => this.toggle_upc_found()}/>
			},
			currently_rendering: <MainMenu goto_interactions={()=>this.goto_interactions()}
				goto_drugs={() => this.goto_drugs()} cam={() => this.change_to_camera()}/>,
			data: {},
			interactions: [],
		};
		this.upc_found = false;
		this.current_drugs = [];
		this.change_to_camera = this.change_to_camera.bind(this);
		this.change_to_menu = this.change_to_menu.bind(this);
		this.store_drug = this.store_drug.bind(this);
		this.goto_drugs = this.goto_drugs.bind(this);
		this.check_db_for_upc = this.check_db_for_upc.bind(this);
		this.get_drugs = this.get_drugs.bind(this);
		this.get_interactions = this.get_interactions.bind(this);
		this.goto_interactions = this.goto_interactions.bind(this);
	}

	componentDidMount() {
		console.log('mount');
		this.db.transaction(tx => {

			tx.executeSql("drop table drugs", [], () => console.log("dropped"),
				(t, e) => console.log(t, e));
			tx.executeSql(
				"create table if not exists drugs (id integer primary key not null, " +
				"brand_name string, manufacturer_name string, do_not_use string, stop_use string," +
				"dosage_and_administration string, product_type string, purpose string, upc string, rxcui string);"
			,[], () => console.log("db success"), (t, err) => console.log(t, err));
			tx.executeSql(
				"create table if not exists drug_ingredients (id integer primary key not null, " +
				"active_ingredient string, drug_id integer references drugs(id));", [],
				() => console.log("ing success"), (t, err) => console.log(t, err));
		});

		fetch("https://api.fda.gov/drug/label.json?search=openfda.upc:0305360970858").then(

			(data) => data.json()).then((data) => {
				this.store_drug(data);
			}
		)
		fetch("https://api.fda.gov/drug/label.json?search=openfda.upc:0312547427555").then(
			(data) => data.json()).then((data) => {
			this.store_drug(data);
		})

		fetch("https://api.fda.gov/drug/label.json?search=openfda.upc:0305730169400").then(
			(data) => data.json()).then((data) => {
			this.store_drug(data);
		})

		fetch("https://api.fda.gov/drug/label.json?search=openfda.upc:0300450449108").then(
			(data) => data.json()).then((data) => {
			this.store_drug(data);
		})


	}

	async goto_interactions(){
		let data = await this.get_interactions();
		console.log("GOTO INTERACTIONS DATA", data);
		this.setState({
				currently_rendering: <Interactions data={data}	menu={()=>this.change_to_menu()}/>
			});
	}

	async goto_drugs(){

		let drugs = await this.get_drugs();
		this.setState({
			currently_rendering: <DrugMenu drugs={drugs} menu={this.change_to_menu}/>
		});
	}

	async get_interactions(){
		let p = new Promise((resolve, reject) => {
				this.db.transaction(tx => {
					tx.executeSql("select * from drugs", [], (t, r) => {
						let req_url = "https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=";
						let drugs = {};
						drugs.interactions = [];
						for (let i = 0; i < r.rows.length; i++) {
							// get all the prescription identifiers. This will be used to check another API for drug interactions.
							drugs[r.rows._array[i].rxcui] = r.rows._array[i].brand_name;
							if (i < r.rows.length - 1) {
								req_url += r.rows._array[i].rxcui + "+";
							} else {
								req_url += r.rows._array[i].rxcui;
							}
						}
						console.log(req_url);
						let d = fetch(req_url)
							.then(resp => resp.json())
							.then(resp => {
							let i = resp.fullInteractionTypeGroup[0].fullInteractionType;
							drugs.interactions.push(i.map((item) => {
								return ({
									pair: [item.minConcept[0].rxcui, item.minConcept[1].rxcui],
									description: item.interactionPair[0].description
								});
							}));
						return drugs;
						});

						d.then(data => {
							console.log(data);
							resolve(data);
							return data})
					});

					}, (t, e) => {
						console.log(t, e)
					})
				})
		return p;
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
		let rxcui = data.openfda.rxcui ? data.openfda.rxcui[0]: null;
		this.db.transaction(tx => {
			tx.executeSql("insert into drugs (brand_name, manufacturer_name, do_not_use, stop_use," +
				"dosage_and_administration, product_type, purpose, upc,rxcui) values(?, ?, ?, ?, ?, ?, ?, ?, ?)",
				[brand_name, manf_name, dnu, stop_use, d_and_a, product_type, purpose, upc,rxcui],
				() =>console.log("SUCCESS"),
				(t, e) => console.log("INSERT ERROR",e, t));

		});

	}

	toggle_upc_found(){
		this.upc_found = false;
	}

	async check_db_for_upc(upc){
			let p = new Promise((resolve, reject)=> {

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
		);
	}

}
