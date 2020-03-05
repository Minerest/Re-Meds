import React from 'react';
import {Text, StyleSheet, View, TextInput, ScrollView, SafeAreaView} from 'react-native';
import * as Haptic from "expo-haptics";
import {BackHandler} from "react-native";


export class SearchBar extends React.Component {

	constructor(props){
		super(props);
		this.current_text = "";
		this.state = {
			results: null,
			text_editable: true,
		}
	}

	componentDidMount() {
		this.backhandler = BackHandler.addEventListener("hardwareBackPress", this.handleBackPress)
	}

	componentWillUnmount() {
		this.backhandler.remove();
	}

	handleBackPress = () => {
		this.props.menu();
	};

	search(){
		// This is the search function. It queries the FDA API for drugs based by name
		const brand_name = this.current_text; // Get the text from the <TextInput /> field

		this.setState({ // This stops the change of the textinput field and shows a Loading text while we make the web request
			results:<Text style={{fontSize: 25, marginRight:"auto", marginLeft:"auto"}}>LOADING</Text>,
			editable:false});

		// This below is the actual request being made. The api is the string below, take note of the use of quotes
		fetch('https://api.fda.gov/drug/label.json?search=openfda.brand_name:"' + brand_name + '"&limit=100')
			// turn the raw text into a javascript object
			.then(raw_data => raw_data.json())
			.then(data => {
				if (data.error){
					// the FDA only returns an error field if the drug is not found or if there are server errors.
					// So I'm just going to return that the drugs are not found
					const not_found_text = <Text>"The results you searched for where not found."</Text>;
					this.setState({results:not_found_text});
					return null;
				}

				// gets items to render from the output of the FDA API
				let to_render = this.get_items(data);
				// update what is rendering on this object based on the items above.
				this.setState({
					results: to_render
				});
			})
			.then(() => {this.setState({text_editable:true})})

	}

	get_items(data){
		// returns an array of items to be rendered
		// boolean to alternate the color scheme
		let even_or_odd = true;
		return data.results.map((item) => {
			even_or_odd = !even_or_odd;
			let style_even_odd = even_or_odd ? styles.even : styles.odd;

			// The HTML-like stuff goes here
			return(
				<View key={item.id} style={[style_even_odd, styles.drug_item]}>
					<View style={{flex:7}}>
						<Text style={styles.drug_header}>
							{item.openfda.brand_name[0]}
						</Text>
						<Text>
							{item.openfda.manufacturer_name}
						</Text>
						<Text>
							{item.openfda.product_type}
						</Text>
					</View>
					<View style={{flex:3, backgroundColor:"blue", // This is the button to store the drug
						height: 70, borderRadius: 20, marginLeft: 40,
						justifyContent: "flex-end", alignItems:"center", alignContent:"center", flexDirection: "row"}}
						  onTouchStart={()=>{Haptic.impactAsync("heavy"); this.props.store_item(item)}}
					>
						<Text style={{alignItems:"center", alignContent:"center",
							color:"white", justifyContent: "center", paddingRight:"25%"}}>
							Store Drug
						</Text>
					</View>
				</View>
			);
		});
	}

	change_input(text){
		this.current_text = text;
	}

	render(){
		console.log("Hello");
		const results = this.state.results; // this gets rendered. Can be drugs, drug not found, or Loading indicator
		console.log("World");
		return(
			<View style={{backgroundColor: "#ccd4db", flex:1}}>
				<View style={{flex:1, margin: "auto", alignContent:"center", flexDirection:"row"}}>
					<TextInput onChangeText={text => this.change_input(text)} autoCorrect={false}
							   placeholder="Enter a drug" onSubmitEditing={()=>this.search()}
							   editable={this.state.text_editable}
							   style={{flex:9, marginTop: 30, alignItems:"center", textAlign: "center", backgroundColor: "white", alignContent:"center"}}/>
				</View>
				<View style={{flex:6}}>
					<ScrollView style={{flex:8}}>
						{results}
					</ScrollView>
				</View>
				<View style={styles.menuView} onTouchStart={()=>{Haptic.impactAsync("heavy");this.props.menu()}} >
					<Text style={styles.menuText} >Menu</Text>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	menuText: {
		alignSelf: "center",
		alignItems: "center",
		color: "white",
		fontSize: 25,

	},
	menuView: {

		flex: 1,
		minWidth: 100,
		backgroundColor: "blue",
		height: 40,
		color: "white",
		overflow: "hidden",
		borderRadius: 20,
		justifyContent: "center",
		alignSelf: "center",
		alignItems: "center",
	},
	drug_header: {
		fontSize: 25,
		fontWeight: "bold",
		flex: 3
	},
	drug_subheader: {
		fontSize: 27,
		flex: 1
	},
	drug_item: {
		flex: 8,
		padding: 40,
		flexDirection:"row",
	},
	header:{
		flex: 1,
		fontSize: 40,
		fontWeight: "bold",
		marginTop: 30,

	},
	odd: {
		backgroundColor: "#3492eb"
	},
	even:{
		backgroundColor: "lightblue"
	},

});