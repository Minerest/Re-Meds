import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export function Interactions(data){
	console.log("INTERACTIONS DATA", data);
	let to_render = data.interactions.map( item => {
		return(
			<View>
				<View>
					<Text>{data.drugs[item.pair[0].rxcui]}</Text>
					<Text>{data.drugs[item.pair[1].rxcui]}</Text>
				</View>
				<Text>{item.pair.descripton}</Text>
			</View>
		)

	});
	return(
		<View>
			{to_render}
		</View>
	)

}