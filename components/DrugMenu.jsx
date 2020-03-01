import React from 'react'
import {Text, View, StyleSheet, ScrollView, SafeAreaView} from "react-native";


function DrugMenu(props) {
		// console.log("PROPS", props.drugs._array);
		// FIELDS: brand_name, manufacturer_name, do_not_use, stop_use," +
		// "dosage_and_administration, product_type, purpose, upc
		let i = 0;
		let odd_or_even
		const items_to_render = props.drugs._array.map(
			(item) => {
				odd_or_even = i % 2 === 0 ? styles.odd : styles.even;
				i++;
				return(
					<View style={[styles.drug_item, odd_or_even]} key={item.upc}>
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
						{/*<Text style={{flex:1}}>{item.results[0].purpose}</Text>*/}
						<View style={{flex:8}}>
							<Text style={styles.drug_subheader}>Dosage and Administration</Text>
							<Text style={{flex:8}}>{item.dosage_and_administration}</Text>
						</View>
					</View>
				)
			}
		);
		return (
			<View style={{backgroundColor: "#ccd4db", flex:1, justifyContent: "center", alignItems:"center"}}>
				<Text style={styles.header}>Drug Registered</Text>
				<SafeAreaView style={{flex:9, marginTop: 30}}>
					<ScrollView style={{flex:8}}>
						{items_to_render}
					</ScrollView>
				</SafeAreaView>
				<View style={styles.menuView} onTouchStart={()=> props.menu()} >
					<Text style={styles.menuText} >Menu</Text>
				</View>
			</View>
		)
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