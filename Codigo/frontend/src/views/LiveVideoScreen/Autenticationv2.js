import React, { useState, useEffect } from 'react';
import { Camera, CameraType, getCameraPermissionsAsync } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';
import { colors } from '../util/Colors';

const SOCKET_URL = 'http://backend:8080'; // Reemplaza con la URL de tu backend en Java

const CamaraScreen = () => {
  const navigation = useNavigation();
  const [cameraPermission, setCameraPermission] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');
    })();
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
    const socket = io(SOCKET_URL);

    const sendVideo = async () => {
      const camera = await Camera.getCameraPermissionsAsync();
      if (camera.status === 'granted') {
        const videoStream = await camera.getAvailableMediaTypesAsync();
        socket.emit('video', videoStream);
      }
    };

    socket.on('results', results => {
      console.log('Resultados del reconocimiento facial:', results);
    });

    sendVideo();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      {cameraPermission && focused ? (
        <Camera style={styles.camera} type={CameraType.front} ratio={'16:9'} zoom={0.0}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Menu')}>
              <Text style={styles.text}>Autenticar</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background, gap: 4 }}>
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
