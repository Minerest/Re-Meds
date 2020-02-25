import React from 'react';
import {Text, View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';

export function Interactions(props){
	let style_object;
	let i = 0;
	console.log("INTERACTIONS DATA", props.data);
	let to_render = props.data.interactions[0].map( item => {
		console.log("ITEM", item);
		console.log("PAIR1", props.data);
		i++;

		style_object = i % 2 === 0 ? styles.pairEven : styles.pairOdd;

		return(
			<View key={i} style={style_object}>
				<View style={styles.pair}>
					<Text style={styles.pairItem}>{props.data[item.pair[0]]}</Text>
					<Text style={styles.pairItem}>{props.data[item.pair[1]]}</Text>
				</View>
				<Text style={{flex:1, margin: 20, fontSize: 20}}>{item.description}</Text>
			</View>
		)

	});
	return(
		<View style={{backgroundColor: "#ccd4db", flex:1, justifyContent: "center", alignItems:"center"}}>
			<Text style={styles.header}>Drug Interactions</Text>
			<SafeAreaView style={{flex:9, marginTop: 30}}>
				<ScrollView style={{flex:8}}>
					{to_render}
				</ScrollView>
			</SafeAreaView>
			<View style={styles.menuView} onTouchStart={()=>props.menu()} >
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