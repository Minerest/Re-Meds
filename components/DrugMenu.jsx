import React from 'react'
import {Text, View, StyleSheet, ScrollView, SafeAreaView} from "react-native";


function DrugMenu(props) {
		// console.log("PROPS", props.drugs._array);

		const items_to_render = props.drugs._array.map(
			(item) => {
				// console.log(item.results[0].active_ingredient);
				console.log("ITEMS!!!", item);
				console.log("upc", item.upc);
				console.log("brand", item.brand_name);
				console.log("active", item.active_ingredient);
				return(
					<View style={styles.drug_item} key={item.upc}>
						<Text style={styles.drug_header}>{item.brand_name}</Text>
						<View style={{flex:5}}>
							<Text style={{flex:5}}>{item.stop_use}</Text>
						</View>
						{/*<Text style={{flex:1}}>{item.results[0].purpose}</Text>*/}
						<Text style={{flex:8}}>{item.dosage_and_administration}</Text>
					</View>
				)
			}
		);
		return (
			<View style={{flex:1, justifyContent: "center", alignItems:"center"}}>
				<SafeAreaView style={{flex:9, marginTop: 30}}>
					<ScrollView style={{flex:8}}>
						{items_to_render}
					</ScrollView>
				</SafeAreaView>
				<Text style={styles.menu_button} onTouchStart={()=> props.menu() }> Menu </Text>
			</View>
		)
}

const styles = StyleSheet.create({
	menu_button: {
		flex: 1,
		backgroundColor: "blue",
		height: 40,
		color: "white",



	},
	drug_header: {
		fontSize: 35,
		flex: 1
	},
	drug_item: {
		flex: 8,
		margin: 20
	}
});

export default DrugMenu;