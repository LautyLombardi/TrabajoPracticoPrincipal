import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import Boton from "@/ui/Boton";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import { useRouter } from "expo-router";
import axios from 'axios';
import { sendImageToBackend } from '@/api/services/util'
import { ONLINE } from '@/api/constantes'
import { logimageVisitor } from "@/api/services/log";

const UserImage = () => {
  const navigator = useRouter();
  const [cameraPermission, setCameraPermission] = useCameraPermissions();
  const [microfonoPermiso, setMicrofonoPermiso] = useMicrophonePermissions();
  const cameraRef = useRef<any>();
  const [imagen, setImagen] = useState<File | null>(null);
  const [dni, setDni] = useState<string>('');

  const handleAutenticacion = async () => {
    await takePicture();
    
    if (!dni) {
      Alert.alert("Error", "Por favor, ingrese el DNI del visitante");
      console.log('DNI no cargados')
      return;
    }
    if (!imagen) {
      return;
    }
  
    try {
      await sendImageToBackend(imagen, dni)
      Alert.alert("Éxito", "Autenticación exitosa");
      navigator.navigate("/menu"); // TODO change to faceRecognition/user
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert("Error", `Error al cargar la imagen: ${error.response?.data?.message || error.message}`);
      } else {
        Alert.alert("Error", `Error al cargar la imagen`);
      }
    }
  };
  
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: false, exif: true, skipProcessing: false };
      const photo = await cameraRef.current.takePictureAsync(options);
      //const imageFile = await uriToFile(imagen.uri);
      setImagen(photo.uri);
      return photo.uri
    }
  };
  

  const handleTerminarBien = async () => {
    if (!dni) {
      Alert.alert("Error", "Por favor, ingrese el DNI del usuario");
      return;
    }

    try {
      const photoUri = await takePicture();
      if (photoUri) {
        const formData = new FormData();
        formData.append('visitor_dni', dni);
        formData.append("image", {
          uri: photoUri,
          name: "photo.jpg",
          type: "image/jpeg",
        });

        // Primera solicitud para registrar la imagen del usuario
        const response = await fetch(`${ONLINE}/image/visitor`, {
          method: 'POST',
          body: formData,
        });

        if (response.status === 200) {
          await logimageVisitor(dni)
          Alert.alert(
            "Registro de imagen de visitante exitoso",
            "",
            [
              { text: "OK", onPress: () => navigator.navigate("/menu") }
            ]
          );
        } else {
          const errorData = await response.json();
          console.log("Error", `Fallo el registro de imagen de visitante: ${errorData.message}`);
          Alert.alert("Fallo el registro de imagen de visitante")
        }
      } else {
        Alert.alert("Error", "No se pudo tomar la foto");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo registrar el visitante");
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} mute={true} flash={'off'} animateShutter={false} facing={CameraType.front} ref={cameraRef}/>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su DNI"
        value={dni}
        onChangeText={setDni}
        keyboardType="numeric"
      />
      <View style={styles.buttonContainer}>
        <Boton
          text="Registrar visitante"
          styleText={styles.text}
          style={styles.button}
          onPress={handleTerminarBien}
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

export default UserImage;
