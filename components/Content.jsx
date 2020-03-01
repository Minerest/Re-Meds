import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


function Content(){
	// contains some hipster lorem ipsum
	return (
		<View style={styles.content}>
			<Text style={styles.content_text}>Tousled pitchfork cloud bread, adaptogen viral trust fund sartorial roof
				party beard tumblr magna. Actually roof party trust fund swag tbh pariatur deep v enim man bun umami
				chambray gentrify. Eiusmod pug jean shorts woke anim. +1 commodo bespoke enamel pin. Ethical keytar
				yuccie id. Hexagon meh pariatur succulents, fanny pack dolore farm-to-table.
			</Text>
			<Text style={styles.content_text}>
				Photo booth pinterest 3 wolf moon cliche narwhal slow-carb laborum qui salvia humblebrag lorem prism
				messenger bag. Cray tousled retro master cleanse yr mustache exercitation before they sold out man bun,
				green juice in beard. Cillum ullamco bespoke XOXO scenester jean shorts raclette proident single-origin
				coffee dolore literally. Esse thundercats ut live-edge.
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	content : {
		backgroundColor: 'powderblue',
		flex: 8,
	},
	content_text : {
		textAlign: "left",
		marginTop: 30,
		marginLeft: 20,
		marginRight: 40
	}
});

export default Content;