import * as React from 'react';
import { AutoFocus, Camera, CameraType } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const MyCamara = ({handleTakePhoto}) => {
    return <>
    <Camera style={styles.camera} type={CameraType.front} useCamera2Api={true} ratio={"16:9"} autoFocus={AutoFocus.on} >
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <Text style={styles.text}>Capturar</Text>
            </TouchableOpacity>
        </View>
      </Camera>
    </>
}

const styles = StyleSheet.create({
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
  });
  
export default MyCamara;