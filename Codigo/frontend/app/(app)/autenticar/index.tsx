import { View, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import Boton from "@/ui/Boton";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

const Login = () => {
  const navigator = useRouter();

  const [cameraPermission, setCameraPermission] = useCameraPermissions();
  const [microfonoPermiso, setMicrofonoPermiso] = useMicrophonePermissions();
  const cameraRef = useRef<any>();
  const [imagen, setImagen] = useState(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.7, base64: false, exif: true, skipProcessing: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      setImagen(photo.uri);
      return photo.uri;
    }
  };

  const handleAuterizar = async () => {
    console.log('presionado')
    try {
      takePicture().then((foto) => {
        const formData = new FormData();
        formData.append("image", { // Ignora el error de append esta alpedo jodiendo
          uri: foto,
          name: "photo.jpg",
          type: "image/jpeg",
        });
        fetch('http://192.168.58.170:5000/faceRecognition/visitor', {
          method: 'POST',
          body: formData
        }).then((respuesta) => {
          console.log(respuesta);
          if (respuesta.status == 200) {
            Alert.alert("AUTENTICACION EXITOSA: " + respuesta.data);
            navigator.navigate("/menu");
          } else {
            Alert.alert("FALLO LA AUTENTICACION DE IMAGEN DE USUARIO");
          }
        });
      });
    } catch (error) {
      Alert.alert("No se pudo sacar la foto");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={{ flex: 1 }} mute={true} flash={'off'} animateShutter={false} facing={CameraType.front} ref={cameraRef} />
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
