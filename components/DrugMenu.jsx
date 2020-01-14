import React from 'react'
import {Text, View, StyleSheet} from "react-native";


function DrugMenu(props) {
		console.log(props.drugs);

		return (
			<View>
				{ props.drugs.map(
				(item) => {
					return(
					<View style={styles.drug_item}>
						<Text>{item.results[0].purpose}</Text>
						<Text>{item.results[0].active_ingredient}</Text>
						<Text>{item.results[0].warnings}</Text>
					</View>
					)
				}
				)
				}

				<Text style={styles.stuff} onTouchStart={()=> props.menu() }> Menu </Text>
			</View>
		)
}

const styles = StyleSheet.create({
	stuff: {
		marginTop: 50
	}
})

export default DrugMenu;