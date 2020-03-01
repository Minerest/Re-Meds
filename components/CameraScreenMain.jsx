import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';


class CameraScreenMain extends React.Component {
	// This is the view that handles all the barcode scanning which would be used to query the FDA API5
	constructor(props) {
		super(props);
		this.state = {
			hasCameraPermission: null, // This changes to "Granted" by the camera API once the users gives permission
			type: Camera.Constants.Type.back, // Not the face camera, but the other camera on the phone
			actively_scanning: true,	// bool to check to see if we're scanning barcodes rn or not.
			error: "" // used to print any errors
		};
	}

	async componentDidMount() {
		// first thing the app does is ask for permissions when the camera is rendered.
		const {status} = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({
			hasCameraPermission: status
		});
	}

	handleBarcodeScan = async ({type, data}) => {
		// This is the function call made by the barcode scanner api once a barcode is found
		// 		type is the barcode type
		// 		and data is the data in the barcode

		// Make sure to stop scanning after a barcode is read.
		this.setState({actively_scanning: false});
		let does_upc_exist = await this.props.check_db_for_upc(data);
		if (does_upc_exist) {
			this.props.toggle_upc();
			return;
		}
		this.props.toggle_upc();
		console.log("https://api.fda.gov/drug/label.json?search=openfda.upc:" + data);
		///the actual request goes here. Make sure you append the data from the barcode at the end
		fetch("https://api.fda.gov/drug/label.json?search=openfda.upc:" + data).then(
			// once the request comes back to us, the rest of the function executes.
			// we first get the data string and turn it into a javascript object
			(data) => data.json()).then((data) => {
				// the interesting stuff should go here.
				console.log("FETCHING");
				if (data.error){
					this.setState({error: "WARNING, UPC NOT FOUND!"});
					return;
				}
				this.props.store_drug(data);
			}
		)
	};

	render() {
		const {hasCameraPermission} = this.state;
		if (hasCameraPermission === null) {
			return <View/>;
		} else if (hasCameraPermission === false) {
			return (
				<View>
					<Text>No access to camera</Text>
					<View style={styles.menubutton} onTouchStart={this.props.menu}>
						<Text>MAIN MENU</Text>
					</View>
				</View>);
		} else {
			return (
				<View style={{flex: 1}}>  {/* container */}
					<BarCodeScanner style={styles.camera} type={this.state.type}
									onBarCodeScanned={!this.state.actively_scanning ? undefined : this.handleBarcodeScan}
					/>
					{/* this is a button that shows up when the barcode scanner is not actively scanning */}
					{!this.state.actively_scanning && (<View  style={styles.textview}
															  onTouchStart={() => this.setState({
																  error: "",
																  actively_scanning: true})}>

						<Text>Scanned {this.state.error}</Text>
					</View>)}
					<View style={styles.menubutton} onTouchStart={this.props.menu}>
						<Text>MAIN MENU</Text>
					</View>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		height: "100%",
	},
	camera: {
		flex: 9
	},
	textview: {
		backgroundColor: "white",
		height: 40
	},
	menubutton: {
		height: 25,
		backgroundColor: "lightblue"
	}
});

export default CameraScreenMain;
