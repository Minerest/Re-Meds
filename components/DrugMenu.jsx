import React from 'react'
import {Text, View, StyleSheet, ScrollView, SafeAreaView} from "react-native";
import * as Haptic from 'expo-haptics';


function DrugMenu(props) {
		// console.log("PROPS", props.drugs._array);
		// FIELDS: brand_name, manufacturer_name, do_not_use, stop_use," +
		// "dosage_and_administration, product_type, purpose, upc
		const items_to_render = get_drugs(props);
		console.log("BEFORE RENDER");
		return (
			<View style={{backgroundColor: "#ccd4db", flex:1, justifyContent: "center", alignItems:"center"}}>
				<Text style={styles.header}>Drug Registered</Text>
				<SafeAreaView style={{flex:9, marginTop: 30}}>
					<ScrollView style={{flex:8}}>
						{items_to_render}
					</ScrollView>
				</SafeAreaView>
				<View style={styles.menuView} onTouchStart={()=> {Haptic.impactAsync("heavy"); props.menu()}} >
					<Text style={styles.menuText} >Menu</Text>
				</View>
			</View>
		)
}

function get_drugs(props){
	let i = 0;
	let odd_or_even;
	return props.drugs._array.map(
		(item) => {
			odd_or_even = i % 2 === 0 ? styles.odd : styles.even;
			i++;
			let k = item.upc ? item.upc : Math.random();
			return(
				<View style={[styles.drug_item, odd_or_even]} key={k}>
					<Text style={styles.drug_header}>{item.brand_name}</Text>
					<View style={{flex:5}}>
						<Text style={styles.drug_subheader}>Purpose</Text>
						<Text style={{flex:5}}>{item.purpose}</Text>
					</View>
					<View style={{flex:5}}>
						<Text style={styles.drug_subheader}>Stop Use</Text>
						<Text style={{flex:5}}>{item.stop_use}</Text>
					</View>
					<View style={{flex:5}}>
						<Text style={styles.drug_subheader}>Do Not Use</Text>
						<Text style={{flex:5}}>{item.do_not_use}</Text>
					</View>
					<View style={{flex:8}}>
						<Text style={styles.drug_subheader}>Dosage and Administration</Text>
						<Text style={{flex:8}}>{item.dosage_and_administration}</Text>
					</View>
					<View onTouchStart={()=>{
						Haptic.impactAsync("heavy");
						props.delete_item(item.brand_name);
					}}
						  style={{backgroundColor:"red", flex:4, height: 60, marginTop: 30,
							  alignItems:"center", justifyContent: "center"}}>
						<Text style={{marginTop:"auto", marginBottom:"auto"}}>Delete</Text>
					</View>
				</View>
			)
		}
	);
}

const styles = StyleSheet.create({
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
		fontSize: 35,
		fontWeight: "bold",
		flex: 1
	},
	drug_subheader: {
		fontSize: 27,
		flex: 1
	},
	drug_item: {
		flex: 8,
		padding: 40
	},

});

export default DrugMenu;