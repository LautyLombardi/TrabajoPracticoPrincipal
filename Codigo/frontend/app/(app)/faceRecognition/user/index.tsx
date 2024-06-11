import React, {useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, Alert, Pressable } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import { useRouter } from "expo-router";
import { ONLINE } from "@/api/constantes";
import { Usuario } from "@/api/model/interfaces";
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFaceRecognition from "@/hooks/user/useFaceRecognition";
import AdmUserModal from "@/components/Modal/AdmUserModel";


const UserFaceRecognition = () => {
  const navigator = useRouter();
  const { user, isLoading, isError } = useFaceRecognition();
  const [cameraPermission, setCameraPermission] = useCameraPermissions();
  const [microfonoPermiso, setMicrofonoPermiso] = useMicrophonePermissions();
  const cameraRef = useRef<any>();
  const [imagen, setImagen] = useState<File | null>(null);
  const [usuario, setUsuario] = useState<Usuario>();
  const [showUser, setShowUser] = useState(false);

  useEffect(() => {
    setUsuario(user)
    console.log('user login', user)
  }, [user])

  const handleCloseUserModal = () => {
    setShowUser(false);
    navigator.navigate("/menu")
  };

  const handleAutenticacion = async () => {
    try {
      takePicture().then((foto) => {
        const formData = new FormData();
        formData.append("image", { // Ignora el error de append esta alpedo jodiendo
          uri: foto,
          name: "photo.jpg",
          type: "image/jpeg",
        });
        fetch(`${ONLINE}/faceRecognition/user`, {
          method: 'POST',
          body: formData
        }).then(async (respuesta) => {
          if (respuesta.status == 200) { 
            //----------------------storage--------------            
            const data = await respuesta.json();
            const user_data = [
              {
                user_dni: data.dni
              },
            ];                      
            await AsyncStorage.setItem('user_data', JSON.stringify(user_data));
            setShowUser(true);
            //------------------------------------
            // TODO log
          } else {
            // TODO log
            Alert.alert(
              "Falló la autenticación de la imagen del usuario",
              "",
              [
                { text: "OK", onPress: () => navigator.navigate("/menu") }
              ]
            );
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
        <Pressable onPress={handleAutenticacion} style={styles.button}>
          <Text style={styles.buttonText}>Autenticar</Text>
        </Pressable>
      </View>

      {showUser && usuario && <AdmUserModal user={usuario} handleCloseModal={handleCloseUserModal} />}
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

export default UserFaceRecognition;
