import React, { useState, useEffect, useRef } from "react";
import { Camera, CameraType, getCameraPermissionsAsync } from "expo-camera";
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../util/Colors";

// Sockete
// import { socket } from '../api/socket';

// Api
import { URL, api } from "../api/api";

const CamaraScreen = () => {
  const navigation = useNavigation();
  const [cameraPermission, setCameraPermission] = useState(false);
  const [focused, setFocused] = useState(false);

  // Test connection
  useEffect(() => {
    const verificarConexion = async () => {
      try {
        // Realizar una solicitud GET al endpoint /test_connection del backend
        const response = await fetch(`${URL}/test`);

        // Verificar si la solicitud fue exitosa
        if (response.ok) {
          // Obtener el cuerpo de la respuesta como JSON
          const data = await response.json();

          // Imprimir el resultado por consola
          console.log("Conexión establecida:", data.connection);

          // Alternativamente, mostrar el resultado en pantalla
          // alert(`Conexión establecida: ${data.connection}`);
        } else {
          console.error("Error al establecer la conexión:", response.status);
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
    };

    // Llamar a la función para verificar la conexión cuando el componente se monta
    verificarConexion();
  }, []);
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  // --------------------------------

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setFocused(true);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setFocused(false);
    });

    return unsubscribe;
  }, [navigation]);

  // -------------------------------

  // Send image to backend
  const cameraRef = useRef(null);
  const [autorizado, setAutorizado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuthentication = async () => {
    setLoading(true);
    try {
      if (cameraRef.current) {
        let options = {
          quality: 0.7,
          base64: false,
          exif: false,
          skipProcessing: true,
        };
        const photo = await cameraRef.current.takePictureAsync(options);
        await sendImageToBackend(photo.uri);
      }
    } catch (error) {
      console.error("Error al autenticar:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendImageToBackend = async (photoUri) => {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: photoUri,
        name: "photoTEST.jpg",
        type: "image/jpeg",
      });

      const response = await fetch(`${URL}/faceRecognition`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setAutorizado(
          data.message === "Usuario autorizado"
        );
        clearAutorizado()
      } else {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData.error);
      }
    } catch (error) {
      console.error("Error al enviar la imagen al backend:", error);
    }
  };

  const clearAutorizado = () => {
    setTimeout(() => {
      setAutorizado(false);
    }, 3000); 
  };

  return (
    <View style={styles.container} >
      {cameraPermission && focused ? (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.front}
          ratio={"16:9"}
          zoom={0.0}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleAuthentication}
              disabled={loading}
            >
              <Text style={styles.text}>Autenticar</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              position: "absolute",
              top: 30,
              left: 0,
              right: 0,
              alignItems: "center",
              paddingVertical: 12,
              backgroundColor: autorizado ? "#00ff00" : "#ff0000",
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>{autorizado ? "Autorizado" : "No Autorizado"}</Text>
          </View>
        </Camera>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            gap: 4,
          }}
        >
          <Text style={styles.text}>Sin acceso a la cámara</Text>
          <Button
            onPress={() =>
              setCameraPermission(Camera.requestCameraPermissionsAsync())
            }
            title="Permitir Cámara"
          />
        </View>
      )}

      <StatusBar type=""/>
    </View>
  );
};

const styles = {
  container: {
    flex: 1
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 10,
  },
  text: {
    color: "white",
    fontSize: 20,
  },
  autorizadoContainer: {
    position: "absolute",
    top: 20, // Colocar arriba
    left: 0,
    right: 0,
    alignItems: "center",
    paddingVertical: 10,
  },
  autorizadoText: {
    color: "white",
    fontSize: 20,
  },
};

export default CamaraScreen;
