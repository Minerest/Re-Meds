import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';


class CameraScreenMain extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			hasCameraPermission: null, // This changes to "Granted" by the camera API once the users gives permission
			type: Camera.Constants.Type.back, // Not the face camera, but the other camera on the phone
			actively_scanning: true,	// bool to check to see if we're scanning barcodes rn or not.
			data: null // request data
		};
	}

	async componentDidMount() {
		const {status} = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({
			hasCameraPermission: status
		});
	}

	handleBarcodeScan = ({type, data}) => {
		// This is the function call made by the barcode scanner api once a barcode is found
		//type is the barcode type
		// and data is the data in the barcode

		// Make sure to stop scanning after a barcode is read.
		this.setState({actively_scanning: false});
		console.log(type);

		const new_data = data.substr(1);
		console.log(new_data);
		//the actual request goes here. Make sure you append the data from the barcode at the end
		fetch("https://api.fda.gov/drug/label.json?search=openfda.upc:" + data).then(

			// once the request comes back to us, the rest of the function executes.
			// we first get the data string and turn it into a javascript object
			(data) => data.json()).then( (data) => {
				// the interesting stuff should go here.
				this.setState({data: data});
			}
		);
	};

	render() {
		const {hasCameraPermission} = this.state;
		if (hasCameraPermission === null) {
			return <View/>;
		} else if (hasCameraPermission === false) {
			return <Text>No access to camera</Text>;
		} else {
			return (
				<View style={{flex: 1}}>
					<BarCodeScanner style={styles.camera} type={this.state.type}
									onBarCodeScanned={ !this.state.actively_scanning ? undefined : this.handleBarcodeScan}
					/>
					{!this.state.actively_scanning && (<View  style={styles.textview}
															  onTouchStart={ () => this.setState({actively_scanning: true})}>
						<Text>Scanned</Text>
					</View>)}
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
	}
});

export default CameraScreenMain;
