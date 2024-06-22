import React, { useRef, useState } from "react";
import { View, StyleSheet, Text, Alert, Pressable, ActivityIndicator } from "react-native";
import { CameraView} from "expo-camera";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import { useRouter } from "expo-router";
import { ONLINE } from "@/api/constantes";
import { Visitante } from "@/api/model/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useFaceRecognition from "@/hooks/visitor/useFaceRecognition";
import FRVisitorModel from "@/components/Modal/FRVisitorModel";
import useInsertFaceRecognitionLogs from "@/hooks/logs/useInsertFaceRecognitionLogs";
import useInsertFaceRecognitionLogsFail from "@/hooks/logs/useInsertFaceRecognitionLogsFail";
import { getAdmDni } from "@/api/services/storage";

const VisitorFaceRecognition = () => {
  const navigator = useRouter();
  const getFaceRecognitionVisitor = useFaceRecognition();
  const cameraRef = useRef<any>();
  const [imagen, setImagen] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [visitante, setVisitante] = useState<Visitante>();
  const [showUser, setShowUser] = useState(false);

  const useFaceRecognitionLogs = useInsertFaceRecognitionLogs()
  const useFaceRecognitionLogsFail = useInsertFaceRecognitionLogsFail()

  const handleCloseUserModal = () => {
    setShowUser(false);
    navigator.navigate("/menu")
  };

  const handleAutenticacion = async () => {
    try {
      const admDni=await getAdmDni();
      const foto = await takePicture();
      const formData = new FormData();
      formData.append("image", {
        uri: foto,
        name: "photo.jpg",
        type: "image/jpeg",
      });
      const respuesta = await fetch(`${ONLINE}/faceRecognition/visitor`, {
        method: 'POST',
        body: formData,
      });
      console.log("respuesta status", respuesta.status);
      if(respuesta.status === 200) {
        const data = await respuesta.json();
        const visitor_data = [
          {
            visitor_dni: data.dni
          },
        ];                      
        await AsyncStorage.setItem('visitor_data', JSON.stringify(visitor_data));
        const visitor = await getFaceRecognitionVisitor(data.dni);
        if(visitor && admDni){
          setVisitante(visitor)
          setLoading(false);
          setShowUser(true);
          useFaceRecognitionLogs(data.dni,admDni,'usuario')
        }        
      } else {
        if(admDni){
          setLoading(false);
          useFaceRecognitionLogsFail(admDni,'usuario')
        }
        Alert.alert("Falló la autenticación de la imagen del visitante")
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("No se pudo sacar la foto");
    }
  };
  
  const takePicture = async () => {
    setLoading(true);
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
        <Pressable disabled={loading} onPress={handleAutenticacion} style={[styles.button, loading && styles.buttonDisabled]}>
          <Text style={styles.buttonText}>Autenticar</Text>
        </Pressable>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      {showUser && visitante && <FRVisitorModel visitor={visitante} handleCloseModal={handleCloseUserModal} />}
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

export default VisitorFaceRecognition;
