import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import io from 'socket.io-client';

const SOCKET_URL = 'http://tu_backend_url:5000'; // Reemplaza con la URL de tu backend

const LiveVideoScreen = () => {
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
            // Aquí recibes los resultados del backend y puedes actualizar la interfaz de tu aplicación
            console.log('Resultados del reconocimiento facial:', results);
        });

        sendVideo();

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <View>
            <Text>Transmitiendo video en vivo...</Text>
        </View>
    );
};

export default LiveVideoScreen;
