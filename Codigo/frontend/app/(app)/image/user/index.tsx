import React, { useRef, useState } from "react";
import { View, StyleSheet, TextInput, Alert, Pressable, Text, ActivityIndicator } from "react-native";
import { CameraView} from "expo-camera";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import { useRouter } from "expo-router";
import { ONLINE } from '@/api/constantes'
import useInsertImageUser from "@/hooks/logs/useInsertImageUser";
import { getAdmDni } from "@/api/services/storage";
import useInsertImageUserFail from "@/hooks/logs/useInsertImageUserFail";

const UserImage = () => {
  const navigator = useRouter();
  const cameraRef = useRef<any>();
  const [imagen, setImagen] = useState<File | null>(null);
  const [dni, setDni] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const insertImageUser = useInsertImageUser();
  const insertImageUserFail=useInsertImageUserFail();

  const takePicture = async () => {
    setLoading(true);
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
      setLoading(false);
      Alert.alert("Error", "Por favor, ingrese el DNI del usuario");
      return;
    }
    const admDni = await getAdmDni()
    if (admDni) {
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
            insertImageUser(admDni, Number(dni))
            setLoading(false);
            Alert.alert(
              "Registro de imagen de usuario exitoso",
              "",
              [
                { text: "OK", onPress: () => navigator.navigate("/menu") }
              ]
            );

          } else {
            insertImageUserFail(admDni,Number(dni))
            setLoading(false);
            const errorData = await response.json();
            console.log(`Fallo el registro de imagen de usuario: ${errorData.message}`);
            Alert.alert("Fallo el registro de imagen de usuario")
          }
        } else {
          insertImageUserFail(admDni,Number(dni))
          setLoading(false);
          Alert.alert("Error", "No se pudo tomar la foto");
        }
      } catch (error) {
        setLoading(false);
        insertImageUserFail(admDni,Number(dni))
        Alert.alert("Error", "No se pudo registrar el usuario");
        console.error("Error:", error);
      }
    }else{
      setLoading(false);
      console.log("no se pudo fetchear admDni")
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} mute={true} flash={'off'} animateShutter={false} facing={CameraType.front} ref={cameraRef} />
      <TextInput
        style={styles.input}
        placeholder="Ingrese su DNI"
        value={dni}
        onChangeText={setDni}
        keyboardType="numeric"
      />
      <View style={styles.buttonContainer}>
        <Pressable disabled={loading} onPress={handleRegistrar} style={[styles.button, loading && styles.buttonDisabled]}>
          <Text style={styles.buttonText}>Registrar usuario</Text>
        </Pressable>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
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
  buttonDisabled: {
    backgroundColor: '#a3a3a3',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserImage;
