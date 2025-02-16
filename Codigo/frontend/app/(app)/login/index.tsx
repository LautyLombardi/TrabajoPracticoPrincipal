import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, Text, Alert, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import { useRouter } from "expo-router";
import { ONLINE} from "@/api/constantes";
import { Usuario } from "@/api/model/interfaces";
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFaceRecognitionUser from "@/hooks/user/useFaceRecognitionUser";
import AdmUserModal from "@/components/Modal/AdmUserModal";
import useInsertFaceRecognitionLogs from "@/hooks/logs/useInsertFaceRecognitionLogs";
import useInsertFaceRecognitionLogsFail from "@/hooks/logs/useInsertFaceRecognitionLogsFail";

const Login = () => {
  const navigator = useRouter()
  const getFaceRecognitionUser = useFaceRecognitionUser();
  const [cameraPermission, setCameraPermission] = useCameraPermissions();
  const [microfonoPermiso, setMicrofonoPermiso] = useMicrophonePermissions();
  const cameraRef = useRef<any>();
  const [imagen, setImagen] = useState(null);
  const [usuario, setUsuario] = useState<Usuario>();
  const [showUser, setShowUser] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const useFaceRecognitionLogs = useInsertFaceRecognitionLogs()
  const useFaceRecognitionLogsFail = useInsertFaceRecognitionLogsFail()
  
  useEffect(() => {
    (async () => {
      const cameraStatus = await setCameraPermission();
      const microphoneStatus = await setMicrofonoPermiso();
      if (cameraStatus.status !== 'granted' || microphoneStatus.status !== 'granted') {
        Alert.alert("Se requieren permisos para utilizar la cámara y el micrófono.");
      }
    })();
  }, []);

  const takePicture = async () => {
    setLoading(true);
    if (cameraRef.current) {
      const options = { quality: 0.7, base64: false, exif: true, skipProcessing: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      setImagen(photo.uri);
      return photo.uri
    }
  };

  const handleCloseUserModal = () => {
    setShowUser(false);
    navigator.navigate("/menu")
  };

  const handleAuterizar = async () => {
    await AsyncStorage.removeItem('adm_data');
    console.log("autenticando.....")
    try{
      const foto = await takePicture();
      const formData = new FormData();
      formData.append("image", {
        uri: foto,
        name: "photo.jpg",
        type: "image/jpeg",
      });
      const respuesta = await fetch(`${ONLINE}/faceRecognition/user`, {
        method: 'POST',
        body: formData,
      });
      console.log("respuesta status", respuesta.status);
      if(respuesta.status === 200) {
        //----------------------storage--------------
        const data = await respuesta.json();
        console.log("data", data)
        const adm_data = [{ adm_dni: data.dni }];                      
        await AsyncStorage.setItem('adm_data', JSON.stringify(adm_data));
        const user = await getFaceRecognitionUser(data.dni);
        console.log("user es ",user)
        if(user){
          setUsuario(user);
          useFaceRecognitionLogs(null, data.dni ,'usuario')
          setLoading(false);
          setShowUser(true);
        }
        //------------------------------------           
      }else{
        useFaceRecognitionLogsFail(null,'usuario')
        setLoading(false);
        Alert.alert( "Falló la autenticación de la imagen del usuario")
      }
    }catch(error){
      setLoading(false);
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
    
        <Pressable disabled={loading} onPress={handleAuterizar} style={[styles.button, loading && styles.buttonDisabled]}>
          <Text style={styles.buttonText}>Autenticar</Text>
        </Pressable>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      {showUser && usuario && <AdmUserModal user={usuario} handleCloseModal={handleCloseUserModal} />}
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

export default Login;