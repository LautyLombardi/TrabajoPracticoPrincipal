import React, { useRef, useState } from "react";
import { View, StyleSheet, TextInput, Alert, Pressable, Text, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import { useRouter } from "expo-router";
import { ONLINE } from '@/api/constantes'
import useInsertImageVisitor from "@/hooks/logs/useInsertImageVisitor";
import useInsertImageVisitorFail from "@/hooks/logs/useInsertImageVisitorFail";
import { getAdmDni } from "@/api/services/storage";
import useCheckDNI from "@/hooks/useCheckDNI";

const VisitorImage = () => {
  const navigator = useRouter();
  const cameraRef = useRef<any>();
  const [imagen, setImagen] = useState<File | null>(null);
  const [dni, setDni] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const InsertImageVisitor = useInsertImageVisitor();
  const InsertImageVisitorFail = useInsertImageVisitorFail();
  const checkDNI = useCheckDNI()

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
      Alert.alert("Error", "Por favor, ingrese el DNI del visitante");
      return;
    }
    const admDni = await getAdmDni()
    if (admDni) {
      try {
        const result = await checkDNI(dni, 'visitor')
        if (result === 0){
          InsertImageVisitorFail(Number(dni), admDni)
          Alert.alert(
            "Fallo el registro de imagen de visitante",
            "El visitante no existe",
            [
              { text: "OK", onPress: () => setDni('') }
            ]
          );
          setLoading(false);
          return
        }
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
            InsertImageVisitor(admDni,Number(dni))
            setLoading(false);
            Alert.alert(
              "Registro de imagen de visitante exitoso",
              "",
              [
                { text: "OK", onPress: () => navigator.navigate("/menu") }
              ]
            );
          } else {
            InsertImageVisitorFail(Number(dni), admDni)
            setLoading(false);
            const errorData = await response.json();
            console.log("Error", `Fallo el registro de imagen de visitante: ${errorData.message}`);
            Alert.alert("Fallo el registro de imagen de visitante")
          }
        } else {
          InsertImageVisitorFail(Number(dni), admDni)
          setLoading(false);
          Alert.alert("Error", "No se pudo tomar la foto");
        }
      } catch (error) {
        InsertImageVisitorFail(Number(dni), admDni)
        setLoading(false);
        Alert.alert("Error", "No se pudo registrar el visitante");
        console.error("Error:", error);
      }
    } else {
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
          <Text style={styles.buttonText}>Registrar visitante</Text>
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

export default VisitorImage;
