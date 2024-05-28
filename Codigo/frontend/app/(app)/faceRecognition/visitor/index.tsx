import React, { useRef, useState } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import Boton from "@/ui/Boton";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import { useRouter } from "expo-router";
import axios from 'axios';
import { faceRecognition } from '@/api/services/faceRecognition';
import { ONLINE,URL } from "@/api/constantes";

const VisitorFaceRecognition = () => {
  const navigator = useRouter();
  const [cameraPermission, setCameraPermission] = useCameraPermissions();
  const [microfonoPermiso, setMicrofonoPermiso] = useMicrophonePermissions();
  const cameraRef = useRef<any>();
  const [imagen, setImagen] = useState<File | null>(null);
  const handleAutenticacion = async () => {
    try {
      takePicture().then((foto) => {
        const formData = new FormData();
        formData.append("image", { // Ignora el error de append esta alpedo jodiendo
          uri: foto,
          name: "photo.jpg",
          type: "image/jpeg",
        });
        fetch(`${ONLINE}/faceRecognition/visitor`, {
          method: 'POST',
          body: formData
        }).then(async (respuesta) => {
          if (respuesta.status == 200) {
            Alert.alert("AUTENTICACION EXITOSA: " + respuesta);
            const data = await respuesta.json(); // Convertir la respuesta a JSON
            console.log("Respuesta del servidor:", data);
            
            const logResponse = await fetch(`${URL}/logs/loginfacerecognition/visitor`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ visitor_dni: data.dni, hasAcces : 1}),
            });
  
            if (logResponse.status === 201) {
              Alert.alert("se creo el log de face recognition")
              navigator.navigate("/menu");
            } else {
              const logErrorData = await logResponse.json();
              Alert.alert("Error", `Fallo al registrar el log: ${logErrorData.message}`);
            }  
          } else {
            Alert.alert("FALLO LA AUTENTICACION DE IMAGEN DE USUARIO");
          }
        });
      });
    } catch (error) {
      Alert.alert("No se pudo sacar la foto");
    }
  };
  
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.7, base64: false, exif: true, skipProcessing: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      setImagen(photo.uri);
      return photo.uri;
    }
  };


  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} mute={true} flash={'off'} animateShutter={false} facing={CameraType.front} ref={cameraRef}/>
      <View style={styles.buttonContainer}>
        <Boton
          text="Autenticar visitante"
          styleText={styles.text}
          style={styles.button}
          onPress={handleAutenticacion}
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
  camera: {
    flex: 1,
    width: "100%",
  },
  input: {
    position: "absolute",
    top: 50,
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    flex: 1,
    marginBottom: 20,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
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
});

export default VisitorFaceRecognition;
