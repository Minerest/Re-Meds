import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {Image} from 'react-native'
import * as Haptic from 'expo-haptics';

// Icons
import camera_icon from './../assets/camera_icon.png';
import search_icon from './../assets/search_icon.png';
import pill_bottle from './../assets/pill_bottle.png';
import doctors_bag from './../assets/doctors_bag.png';
import me from './../assets/cheif_of_medicine.png';


class SideBar extends React.Component {
	// creates the side bar buttons on the side.
	render(){

		return (
			<View style={styles.sidebar}>
				<View onTouchStart={() => { Haptic.impactAsync("heavy"); this.props.cam();}
				} style={[styles.sidebar_option, {marginTop:0}]}>
					<Text style={{marginLeft:"auto", marginRight:"auto"}}>
						Camera
					</Text>
					<Image source={camera_icon} style={{marginLeft:"auto", marginRight:"auto", borderRadius: 15, marginTop:15}}/>
				</View>
				<View style={styles.sidebar_option}>
					<Text style={{marginLeft:"auto", marginRight:"auto"}}>
						About Me
					</Text>
					<Image source={me} style={{marginLeft:"auto", marginRight:"auto", borderRadius: 15, marginTop:15}}/>

				</View>
				<View onTouchStart={()=>{Haptic.impactAsync("heavy"); this.props.goto_searchbar();}}
					  style={styles.sidebar_option}>
					<Text style={{marginLeft:"auto", marginRight:"auto"}}>
						Search
					</Text>
					<Image source={search_icon} style={{marginLeft:"auto", marginRight:"auto", borderRadius: 15, marginTop:15}}/>
				</View>
				<View style={styles.sidebar_option}
					  onTouchStart={()=>{Haptic.impactAsync("heavy"); this.props.goto_interactions()}}>
					<Text style={{marginLeft:"auto", marginRight:"auto", textAlign:"center"}} >
						Drug Interactions
					</Text>
					<Image source={doctors_bag} style={{marginLeft:"auto", marginRight:"auto", marginTop:5}}/>

				</View>
				<View style={styles.sidebar_option}
					  onTouchStart={()=>{Haptic.impactAsync("heavy");this.props.goto_drugs()}}>
					<Text style={{marginLeft:"auto", marginRight:"auto"}}>
						Drugs
					</Text>
					<Image source={pill_bottle} style={{marginLeft:"auto", marginRight:"auto", borderRadius: 15, marginTop:15}}/>

				</View>
			</View>
		)
	};
}

let styles = StyleSheet.create({
	sidebar : {
		flex: 3,
		backgroundColor: "black",
		flexDirection: "column",
		paddingRight: 10,

	},
	sidebar_option : {
		backgroundColor: "yellow",
		marginTop: 40,
		marginLeft: 10,
		textAlign: "center",
		flex: 1,
		overflow: "hidden",
		borderRadius: 10,
	}
});
export default SideBar;
