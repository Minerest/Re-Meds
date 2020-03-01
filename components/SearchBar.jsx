import React from 'react';
import {Text, StyleSheet, View, TextInput, ScrollView, SafeAreaView} from 'react-native';


export class SearchBar extends React.Component {
	constructor(props){
		super(props);
		this.current_text = "";
		this.state = {
			results: null,
			text_editable: true,
		}
	}


	search(){
		const brand_name = this.current_text;
		this.setState({
			results:<Text style={{fontSize: 25, marginRight:"auto", marginLeft:"auto"}}>LOADING</Text>,
			editable:false});
		fetch('https://api.fda.gov/drug/label.json?search=openfda.brand_name:"' + brand_name + '"&limit=100')
			.then(raw_data => raw_data.json())
			.then(data => {
				if (data.error){
					const not_found_text = <Text>"The results you searched for where not found."</Text>
					this.setState({results:not_found_text});
					return null;
				}
				let even_or_odd = true;
				let to_render = data.results.map((item) => {
					console.log(item);
					even_or_odd = !even_or_odd;
					let style_even_odd = even_or_odd ? styles.even:styles.odd;

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
								<Text>

								</Text>
							</View>
							<View style={{flex:3, backgroundColor:"blue",
								height: 70, borderRadius: 20, marginLeft: 40,
								justifyContent: "flex-end", alignItems:"center", alignContent:"center", flexDirection: "row"}}
								onTouchStart={()=>this.props.store_item(item)}
							>
								<Text style={{alignItems:"center", alignContent:"center",
									color:"white", justifyContent: "center", paddingRight:"25%"}}>
									Store Drug
								</Text>
							</View>
						</View>
					)
				})
				this.setState({results:to_render});
			}).then(() => {this.setState({text_editable:true})})

	}

	change_input(text){
		this.current_text = text;
	}

	render(){

		const results = this.state.results;

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
				<View style={styles.menuView} onTouchStart={()=>this.props.menu()} >
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