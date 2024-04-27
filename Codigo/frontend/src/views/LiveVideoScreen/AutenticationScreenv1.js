import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraType, getCameraPermissionsAsync } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client'; // Importa la librería de cliente de Socket.io
import { colors } from '../util/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const SOCKET_URL = 'http://tu_servidor_de_signalizacion:3000'; // Reemplaza con la URL de tu servidor de señalización

const CamaraScreen = () => {
  const navigation = useNavigation();
  const [cameraPermission, setCameraPermission] = useState(false);
  const [focused, setFocused] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const socket = useRef(io(SOCKET_URL)); // Crea una referencia mutable para el socket

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');
    })() ;
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setFocused(true);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setFocused(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const init = async () => {
      const stream = await getCameraPermissionsAsync();
      setLocalStream(stream);
    };
    init();

    // Establece las conexiones WebRTC aquí

    return () => {
      // Limpia las conexiones WebRTC aquí
    };
  }, []);

  const handleCall = () => {
    // Inicia la llamada aquí
    // Implementa la lógica para establecer la conexión WebRTC
  };

  return (
    <View style={styles.container}>
        {cameraPermission && focused ? (
          <Camera style={styles.camera} type={CameraType.front} ratio={'16:9'} zoom={0.0} ref={localStream}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleCall}>
                <Text style={styles.text}>Autenticar</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        ) : (
          <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background, gap: 4}}>
            <Text style={styles.text}>Sin acceso a la cámara</Text>
            <Button onPress={() => getCameraPermissionsAsync()} title='Permitir Cámara' />      
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 20,
    marginHorizontal: 40
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#255ff1',
    borderWidth: 1,
    borderColor: '#f1f1f1',
    padding: 10,
    borderRadius: 20
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CamaraScreen;
