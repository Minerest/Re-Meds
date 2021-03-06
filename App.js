import React from 'react';
import * as SQLite from 'expo-sqlite';

import {SearchBar} from "./components/SearchBar.jsx";
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
				"MainMenu": 	<MainMenu goto_interactions={()=>this.goto_interactions()}
										  goto_searchbar={()=>this.goto_searchbar()}
										  goto_drugs={() => this.goto_drugs()} cam={() => this.change_to_camera()}/>,

				"BarcodeReader": <CameraScreenMain

					store_drug={(data) 		=> this.store_drug(data)}
					menu={() 				=> this.change_to_menu()}
					check_db_for_upc={(upc) => this.check_db_for_upc(upc)}
					toggle_upc={() 			=> this.toggle_upc_found()}
				/>,

				"SearchBar":	<SearchBar
					menu={()				=>this.change_to_menu()}
					store_item={(item) => this.add_data_to_database(item)}
				/>
			},
			currently_rendering: <MainMenu goto_searchbar={()=>this.goto_searchbar()}
										   goto_interactions={()=>this.goto_interactions()}
										   goto_drugs={() => this.goto_drugs()}
										   cam={() => this.change_to_camera()}
			/>,
			data: {},
			interactions: [],
		};
		this.upc_found = false;
		this.current_drugs = [];
		this.debugging = false;
		this.change_to_camera = this.change_to_camera.bind(this);
		this.change_to_menu = this.change_to_menu.bind(this);
		this.store_drug = this.store_drug.bind(this);
		this.goto_drugs = this.goto_drugs.bind(this);
		this.check_db_for_upc = this.check_db_for_upc.bind(this);
		this.get_drugs = this.get_drugs.bind(this);
		this.get_interactions = this.get_interactions.bind(this);
		this.goto_interactions = this.goto_interactions.bind(this);
		this.goto_searchbar = this.goto_searchbar.bind(this);
		this.delete_item = this.delete_item.bind(this);
	}

	debug_fetcher(arr){
		for (let i = 0; i < arr.length; i++){
			fetch("https://api.fda.gov/drug/label.json?search=openfda.upc:" + arr[i]).then(
				(data) => data.json()).then((data) => {
				this.store_drug(data);
			});
		}
	}

	componentDidMount() {
		this.db.transaction(tx => {
			if (this.debugging)
				tx.executeSql("drop table drugs", [], () => console.log("dropped"),
					(t, e) => console.log(t, e));

			// Create the SQLite database, need to do this on first launch.
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
		// Different UPC's for debugging purposes. Listerine, Tylenol, Advil, Coughsyrup and Claratin
		let arr = ["0305360970858","0312547427555", "0305730169400","0300450449108", "0041100809643"];
		if (this.debugging)
			this.debug_fetcher(arr); // gets a set of drugs and stores them onstartup.
	}

	async goto_interactions(){
		// renders the interactions View. This makes a web request based on the drugs stored on the database.
		let data = await this.get_interactions();
		this.setState({
				currently_rendering: <Interactions data={data}	menu={()=>this.change_to_menu()}/>
			});
	}

	delete_item(item){
		// Deletes an item from the database
		this.db.transaction(tx => {
			tx.executeSql(
				"delete from drugs where brand_name = ?", [item], () => console.log("Success"),
				() => {console.log("ERROR")}
			);
		})
	}

	async goto_drugs(){
		// renders the drugs registered view.
		let drugs = await this.get_drugs();

		// The delete_item function is passed into the DrugMenu function.
		// The drug menu renders a list of drugs and each drug has its own ID that will be passed to the delete_item funciton
		this.setState({
			currently_rendering: <DrugMenu delete_item={(brand_name) => this.delete_item(brand_name)}
										   drugs={drugs} menu={this.change_to_menu}/>
		});
	}

	goto_searchbar(){
		// Renders the search view.
		// The function add_data_to_database(item) will be called from within the searchbar view.

		this.setState({currently_rendering: <SearchBar
				store_item={(item) => this.add_data_to_database(item)}
				menu={()=>this.change_to_menu()} />})
	}

	async get_interactions(){
		// This function needs to be refactored. A lot of frusteration went into developing the interactions portion
		// The biggest problem was handling the promises. It became immediately obvious to me that I barely know how to use promises
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
							if (!resp.fullInteractionTypeGroup){
								console.log("NOT FOUND");
								resolve(null);
								return null;
							}
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
							if (!data){
								return null
							}

							resolve(data);
							return data})
					});

					}, (t, e) => {
						console.log(t, e)
					})
				});
		return p;
	}


	add_data_to_database(data){
		// stores items to the local database

		// I have to do this because the FDA assumes EVERYTHING is an array and the field may not exist.
		// If I try to store the item without checking if it exists, the app will crash.
		let brand_name = data.openfda.brand_name ? data.openfda.brand_name[0] : null;
		let manf_name = data.openfda.manufacturer_name ? data.openfda.manufacturer_name[0] : null;
		let dnu = data.do_not_use ? data.do_not_use[0] : null;
		let stop_use = data.stop_use ? data.stop_use[0] : null;
		let d_and_a = data.dosage_and_administration ? data.dosage_and_administration[0] : null;
		let product_type = data.openfda.product_type ? data.openfda.product_type[0] : null;
		let purpose = data.purpose ? data.purpose[0] : null;
		let upc = data.openfda.upc ? data.openfda.upc[0] : null;
		let rxcui = data.openfda.rxcui ? data.openfda.rxcui[0]: null;

		// This is the statement that actually stores the data.
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
		// As you can see, this promise went a little more smoothly.
		// This function checks the database to see if the UPC has been stored. If it has, no need to ask the FDA API.
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
		// TODO: Refactor
		this.add_data_to_database(data.results[0]);
	}

	async get_drugs(){
		// returns every row from the drugs array. Should only contain the drugs currently being taken
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
		// renders the barcode scanning view
		this.setState({currently_rendering: this.state.appletts["BarcodeReader"]})
	}

	change_to_menu() {
		// renders the main menu view
		this.setState({currently_rendering: this.state.appletts["MainMenu"]})
	}

	render() {
		// the render function of the current app.
		return (
			this.state.currently_rendering
		);
	}

}
