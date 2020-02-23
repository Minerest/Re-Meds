import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export function Interactions(props){

	let i = 0;
	console.log("INTERACTIONS DATA", props.data);
	let to_render = props.data.interactions[0].map( item => {
		console.log("ITEM", item);
		console.log("PAIR1", props.data);
		i++;
		return(
			<View key={i} style={{flex:1}}>
				<View style={{flex:1, flexDirection:"row"}}>
					<Text style={{flex:1, fontSize: 25}}>{props.data[item.pair[0]]}</Text>
					<Text style={{flex:1, fontSize: 25}}>{props.data[item.pair[1]]}</Text>
				</View>
				<Text style={{flex:1}}>{item.description}</Text>
			</View>
		)

	});
	return(
		<View style={{flex:1, marginTop: 50}}>
			{to_render}
		</View>
	)

}