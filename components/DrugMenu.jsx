import React from 'react'
import {Text, StyleSheet} from "react-native";


function DrugMenu(props) {
		console.log("Try to render");
		return (<Text style={styles.stuff} onTouchStart={()=> props.menu() }> Drug Menu </Text>)
}

const styles = StyleSheet.create({
	stuff: {
		marginTop: 50
	}
})

export default DrugMenu;