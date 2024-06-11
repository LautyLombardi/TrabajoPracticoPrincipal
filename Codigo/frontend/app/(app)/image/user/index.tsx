import React, { useRef, useState } from "react";
import { View, StyleSheet, TextInput, Alert, Pressable, Text } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import { useRouter } from "expo-router";
import { ONLINE } from '@/api/constantes'

const UserImage = () => {
  const navigator = useRouter();
  const [cameraPermission, setCameraPermission] = useCameraPermissions();
  const [microfonoPermiso, setMicrofonoPermiso] = useMicrophonePermissions();
  const cameraRef = useRef<any>();
  const [imagen, setImagen] = useState<File | null>(null);
  const [dni, setDni] = useState<string>('');
  
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: false, exif: true, skipProcessing: false };
      const photo = await cameraRef.current.takePictureAsync(options);
      //const imageFile = await uriToFile(imagen.uri);
      setImagen(photo.uri);
      return photo.uri
    }
  };
  
  const handleRegistrar = async () => {
    if (!dni) {
      Alert.alert("Error", "Por favor, ingrese el DNI del usuario");
      return;
    }

    try {
      const photoUri = await takePicture();
      if (photoUri) {
        const formData = new FormData();
        formData.append('user_dni', dni);
        formData.append("image", {
          uri: photoUri,
          name: "photo.jpg",
          type: "image/jpeg",
        });

        // Primera solicitud para registrar la imagen del usuario
        const response = await fetch(`${ONLINE}/image/user`, {
          method: 'POST',
          body: formData,
        });

        if (response.status === 200) {
          // TODO: log
          Alert.alert(
            "Registro de imagen de usuario exitoso",
            "",
            [
              { text: "OK", onPress: () => navigator.navigate("/menu") }
            ]
          );

        } else {
          // TODO: log
          const errorData = await response.json();
          console.log(`Fallo el registro de imagen de usuario: ${errorData.message}`);
          Alert.alert("Fallo el registro de imagen de usuario")
        }
      } else {
        // TODO: log
        Alert.alert("Error", "No se pudo tomar la foto");
      }
    } catch (error) {
      // TODO: log
      Alert.alert("Error", "No se pudo registrar el usuario");
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
      <Pressable onPress={handleRegistrar} style={styles.button}>
        <Text style={styles.buttonText}>Registrar usuario</Text>
      </Pressable>
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

export default UserImage;
