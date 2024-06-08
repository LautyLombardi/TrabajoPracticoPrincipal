import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

LogBox.ignoreAllLogs(true);

const Welcome = () => {
    const [institutionalImage, setInstitutionalImage] = useState<string | null>(null);

    const loadInstitutionalImage = async () => {
        try {
        const imageUri = await AsyncStorage.getItem('institutionalImage');
        setInstitutionalImage(imageUri);
        } catch (error) {
        console.error('Error loading institutional image:', error);
        }
    };

    const setDayStatus = async () => {
        try {
        const openHour = await AsyncStorage.getItem('openHour');
        const closeHour = await AsyncStorage.getItem('closeHour');
        
        if (openHour && closeHour) {
            const [openHourHours, openHourMinutes] = openHour.split(':').map(Number);
            const [closeHourHours, closeHourMinutes] = closeHour.split(':').map(Number);
            
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();

            const isOpen = (currentHours > openHourHours || (currentHours === openHourHours && currentMinutes >= openHourMinutes)) &&
                            (currentHours < closeHourHours || (currentHours === closeHourHours && currentMinutes < closeHourMinutes));
            
            await AsyncStorage.setItem('dayStatus', JSON.stringify(isOpen));
        } else {
            await AsyncStorage.setItem('dayStatus', JSON.stringify(true));
        }
        } catch (error) {
        console.error('Error al establecer el estado del día:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
        setDayStatus();
        loadInstitutionalImage();
        }, [])
    );

    useEffect(() => {
        setDayStatus();
        loadInstitutionalImage();
    }, []);

    return (
        <>
        <View style={styles.container}>
            <View style={styles.titleContainer}>
            {institutionalImage ? (
                <Image
                source={{ uri: institutionalImage }}
                style={styles.logo}
                />
            ) : (
                <Image
                source={require('../../assets/images/ungs.png')}
                style={styles.logo}
                />
            )}
            <Text style={styles.title}>MSS</Text>
            </View>
            <Link href={"/login"} asChild>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>
                Iniciar Sesión
                </Text>
            </TouchableOpacity>
            </Link>
        </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00759c',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 30,
    },
    button: {
        backgroundColor: "#000b",
        width: "80%",
        padding: 20,
        borderRadius: 5,
    },
    text: {
        color: "#fff",
        textAlign: "center",
        fontSize: 20,
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 40,
        textAlign: 'center',
    },
});

export default Welcome;
