import { View, StyleSheet, Pressable, Text } from "react-native";
import React, { useRef, useState } from "react";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import Boton from "@/ui/Boton";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import { useRouter } from "expo-router";
import { Alert} from "react-native";
import { ONLINE} from "@/api/constantes";
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = () => {
  const navigator = useRouter()

    const [cameraPermission, setCameraPermission] = useCameraPermissions();
    const [microfonoPermiso, setMicrofonoPermiso] = useMicrophonePermissions();
    const cameraRef = useRef<any>();
    const [imagen, setImagen] = useState(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.7, base64: false, exif: true, skipProcessing: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      setImagen(photo.uri);
      return photo.uri
    }
  };
  
  const handleAuterizar = async () => {
    try{
      /* takePicture().then((foto) => {
        const formData= new FormData()
        formData.append("image", { // Ignora el error de append esta alpedo jodiendo
          uri: foto,
          name: "photo.jpg",
          type: "image/jpeg",
        })
          fetch(`${ONLINE}/faceRecognition/user`,{
          method : 'POST',
          body: formData
        }).then(async (respuesta) => {
          console.log(respuesta + "respuesta autenticacion ")
          if(respuesta.status == 200){ */

            //----------------------storage--------------
            //const data = await respuesta.json();
            const data = {dni:43026602};
                
            const adm_data = [
              {
                adm_dni: data.dni
              },
            ];                      
            await AsyncStorage.setItem('adm_data', JSON.stringify(adm_data));
            //------------------------------------
            // TODO: log
            Alert.alert(
              "Autenticación exitosa",
              "",
              [
                { text: "OK", onPress: () => navigator.navigate("/menu") }
              ]
            )
          /* }else{
            // TODO: log
            Alert.alert( "Falló la autenticación de la imagen del usuario")
          }
        })
      }) */
    }catch(error){
      console.error("No se pudo sacar la foto", error)
      Alert.alert("No se pudo sacar la foto")
    }
  }


    return (
    <View style={styles.container}>
      <CameraView style={{flex: 1}} mute={true} flash={'off'} animateShutter={false} facing={CameraType.front}  ref={cameraRef}/>      
        <View
        style={{
            position: "absolute",
            bottom: 0,
            flex: 1,
            marginBottom: 20,
            width: "100%",
            alignSelf: "center",
            alignItems: "center",
        }}
        >
          <Pressable onPress={handleAuterizar} style={styles.button}>
            <Text style={styles.buttonText}>Autenticar</Text>
          </Pressable>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: "#fff",
    textAlign: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#000051',
    fontSize: 16,
  },
});

export default Login;