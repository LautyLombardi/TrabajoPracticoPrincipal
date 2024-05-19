import React, { useRef, useState } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import Boton from "@/ui/Boton";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import { useRouter } from "expo-router";
import axios from 'axios';
import { insertImage } from '@/api/services/image';

const VisitorImage = () => {
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
      await insertImage(parseInt(dni), imagen, 'visitor', 'visitor_dni');
      Alert.alert("Éxito", "Autenticación exitosa");
      navigator.navigate("/menu"); // TODO change to faceRecognition/visitor
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
      const options = { quality: 1, base64: false, exif: true, skipProcessing: true };
      const imagen = await cameraRef.current.takePictureAsync(options);
      const imageFile = await uriToFile(imagen.uri);
      setImagen(imageFile);
    }
  };

  const uriToFile = async (uri: string): Promise<File> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
    return file;
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

export default VisitorImage;