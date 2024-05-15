import { View, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";

import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import Boton from "@/ui/Boton";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import { useRouter } from "expo-router";

const Login = () => {
   const navigator = useRouter()

    const [cameraPermission, setCameraPermission] = useCameraPermissions();
    const [microfonoPermiso, setMicrofonoPermiso] = useMicrophonePermissions();
    const cameraRef = useRef<any>();
    const [imagen, setImagen] = useState(null);

    const handleAutenticacion = () => {
      takePicture()
      // Enviar laas cosas al backend 

      navigator.navigate("/menu")
    };

    const takePicture = async () => {
      if (cameraRef.current) {
        const options = { quality: 1, base64: false, exif: true, skipProcessing: true };
        const imagen = await cameraRef.current.takePictureAsync(options);
        setImagen(imagen);
        console.log(imagen)
      }
    };


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
