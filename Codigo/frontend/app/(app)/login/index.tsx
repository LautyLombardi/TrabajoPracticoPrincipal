import { View, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";

import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import Boton from "@/ui/Boton";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import { useRouter } from "expo-router";
import { Alert} from "react-native";
import { ONLINE,URL} from "@/api/constantes";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserById } from "@/api/services/user";
import { getAbmDni } from "@/api/services/openCloseDay";


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
        takePicture().then((foto) => {
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
            if(respuesta.status == 200){
             Alert.alert("AUTENTICACION EXITOSA: ")

             //----------------------storage--------------
              const data = await respuesta.json(); // Convertir la respuesta a JSON
              
              const rol=await getUserById(data.dni)

              const adm_data = [
                {
                  adm_dni: data.dni,
                  role: rol
                },
              ];
              
              await AsyncStorage.setItem('adm_data', JSON.stringify(adm_data));
              //------------------------------------

              const logResponse = await fetch(`${URL}/logs/loginfacerecognition/user`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_dni: data.dni, hasAcces : 1}),
              });
    
              if (logResponse.status === 201) {
                Alert.alert("se creo el log de face recognition")
                navigator.navigate("/menu");
              } else {
                const logErrorData = await logResponse.json();
                Alert.alert("Error", `Fallo al registrar el log: ${logErrorData.message}`);
              } 

            }else{
              Alert.alert("Error al autenticar usuario: ")
              
              const data = await respuesta.json(); // Convertir la respuesta a JSON
  
              const logResponse = await fetch(`${URL}/logs/loginfacerecognition/user`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_dni: getAbmDni(), hasAccess : 0}),
              });

              if (logResponse.status === 201) {
                Alert.alert("se creo el log de face recognition")

              } else {
                const logErrorData = await logResponse.json();
                Alert.alert("Error", `Fallo al registrar el log: ${logErrorData.message}`);
              } 

            }
          })
        })
      }catch(error){
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
        <Boton
            text="Autenticar"
            styleText={styles.text}
            style={styles.button}
            onPress={handleAuterizar}
            hoverColor="#000000aa"
        />
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  button: {
    backgroundColor: "#000b",
    width: 300,
    padding: 20,
    borderRadius: 12,
  },

  text: {
    color: "#fff",
    textAlign: "center",
  },

  camera: {
    flex: 1,
    width: "100%",
  },
});

export default Login;