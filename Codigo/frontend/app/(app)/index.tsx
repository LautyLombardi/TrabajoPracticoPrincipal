import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import useInsertOpenCloseAutom from '@/hooks/logs/useInsertOpenCloseAutom';
import useProcessEntryLogs from '@/hooks/logs/useAutomaticEgresos';

LogBox.ignoreAllLogs(true);

const Welcome = () => {
    const insertOpenCloseAutom = useInsertOpenCloseAutom()
    const [institutionalImage, setInstitutionalImage] = useState<string | null>(null);
    const automaticEgreso = useProcessEntryLogs()

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
            const lastExecutionDate = await AsyncStorage.getItem('lastExecutionDate');

            const now = new Date();
            const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

            // Reset flags daily
            if (lastExecutionDate !== today) {
                await AsyncStorage.removeItem('aperturaRealizada');
                await AsyncStorage.removeItem('cierreRealizada');
                await AsyncStorage.setItem('lastExecutionDate', today);
            }

            if (openHour && closeHour) {
                const [openHourHours, openHourMinutes] = openHour.split(':').map(Number);
                const [closeHourHours, closeHourMinutes] = closeHour.split(':').map(Number);
                
                const currentHours = now.getHours();
                const currentMinutes = now.getMinutes();

                const isOpen = 
                        (currentHours > openHourHours || (currentHours === openHourHours && currentMinutes >= openHourMinutes)) ||
                        (currentHours < closeHourHours || (currentHours === closeHourHours && currentMinutes < closeHourMinutes));

                const aperturaRealizada = await AsyncStorage.getItem('aperturaRealizada') === 'true';
                const cierreRealizada = await AsyncStorage.getItem('cierreRealizada') === 'true';

                console.log('openHour', openHour)
                console.log('closeHour', closeHour)
                console.log('lastExecutionDate', lastExecutionDate)
                console.log('aperturaRealizada', aperturaRealizada)
                console.log('cierreRealizada', cierreRealizada)
                console.log('isOpen', isOpen)

                if (!aperturaRealizada) {
                    await insertOpenCloseAutom(openHour, closeHour, true);
                    await AsyncStorage.setItem('aperturaRealizada', 'true');
                }

                if (!cierreRealizada) {
                    await insertOpenCloseAutom(openHour, closeHour, false);
                    await AsyncStorage.setItem('cierreRealizada', 'true');
                    await automaticEgreso()
                }

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
            <Link href={"/login/manual"} asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>Iniciar Sesión Manual</Text>
                </TouchableOpacity>
            </Link>
            <Link href={"/login"} asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>Iniciar Sesión con Reconocimiento Facial</Text>
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
        marginBottom:10
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
