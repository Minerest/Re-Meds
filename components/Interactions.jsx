import React from 'react';
import {Text, View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import * as Haptic from "expo-haptics";

export function Interactions(props){
	// interactions is a function used to render drug interactions. The drug interactions are passed from the App.js data object

	let to_render = get_render(props.data);
	return(
		<View style={{backgroundColor: "#ccd4db", flex:1, justifyContent: "center", alignItems:"center"}}>
			<Text style={styles.header}>Drug Interactions</Text>
			<SafeAreaView style={{flex:9, marginTop: 30}}>
				<ScrollView style={{flex:8}}>
					{to_render}
				</ScrollView>
			</SafeAreaView>
			<View style={styles.menuView} onTouchStart={()=>{Haptic.impactAsync("heavy");props.menu()}} >
				<Text style={styles.menuText} >Menu</Text>
			</View>
		</View>
	)

}

function get_render(data){
	// this function gets the data passed into the Interactions object and turns it into ReactNative text.
	// It is basically an array of text tags that gets rendered.

	let style_object;
	let i = 0;
	let to_render;
	if (data){

		to_render = data.interactions[0].map( item => {

			// i is a counter to keep track of the color scheme.
			i++;
			style_object = i % 2 === 0 ? styles.pairEven : styles.pairOdd;

			return(
				<View key={i} style={style_object}>
					<View style={styles.pair}>
						<Text style={styles.pairItem}>{data[item.pair[0]]}</Text>
						<Text style={styles.pairItem}>{data[item.pair[1]]}</Text>
					</View>
					<Text style={{flex:1, margin: 20, fontSize: 20}}>{item.description}</Text>
				</View>
			);
		});
	}
	else {
		to_render = <Text>No Interactions Found!!!</Text>
	}
	return to_render;

}

const styles = StyleSheet.create({
	header:{
		flex: 1,
		fontSize: 40,
		fontWeight: "bold",
		marginTop: 30,

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
	pairItem: {
		flex:1,
		fontSize: 25,
		fontWeight: "bold",
	},
	pairOdd: {
		backgroundColor: "lightblue"
	},
	pairEven: {
		backgroundColor: "#3492eb"
	},
	pair: {
		flexDirection: "row",
		flex: 1,
		margin: 15
	},
	desc: {
		flex:1
	},
	pairContainer: {
		flex: 1
	}
})