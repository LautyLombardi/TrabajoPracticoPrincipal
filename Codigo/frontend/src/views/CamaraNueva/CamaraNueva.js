import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';

const CameraNueva = () => {
  const cameraRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [isSocketEnabled, setIsSocketEnabled] = useState(false);
  const [countdown, setCountdown] = useState(10); // Contador de 10 segundos
  const navigation = useNavigation();

  useEffect(() => {
    if (socket && isSocketEnabled) {
      const sendFrame = async () => {
        if (cameraRef.current) {
          const options = { quality: 0.5, base64: true };
          const data = await cameraRef.current.takePictureAsync(options);
          socket.emit('stream', data.base64);
        }
      };

      const interval = setInterval(sendFrame, 1000); // Enviar un frame cada segundo

      return () => {
        clearInterval(interval);
      };
    }
  }, [socket, isSocketEnabled]);

  const handleAuthButtonPress = () => {
    if (!socket) {
      const newSocket = io('http://127.0.0.1:5000');
      setSocket(newSocket);
    }
    setIsSocketEnabled(true);

    // Iniciar el contador
    const timer = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    // Detener el contador después de 10 segundos
    setTimeout(() => {
      clearInterval(timer);
      setIsSocketEnabled(false);
      socket.disconnect();
      navigation.navigate('Menu');
    }, 10000);
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        ref={cameraRef}
        type={Camera.Constants.Type.front}
      />
      <TouchableOpacity
        style={styles.authButton}
        onPress={handleAuthButtonPress}
        disabled={isSocketEnabled}
      >
        <Text style={styles.buttonText}>Autenticar</Text>
      </TouchableOpacity>
      {isSocketEnabled && (
        <Text style={styles.countdownText}>Tiempo restante: {countdown} segundos</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  camera: {
    width: '100%',
    height: '80%',
  },
  authButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  countdownText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
});

export default CameraNueva;