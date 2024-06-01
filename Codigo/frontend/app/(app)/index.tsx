import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);

const Welcome = () => {
    return (
        <>
            <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Image
                source={require('../../assets/images/ungs.png')}
                style={styles.logo}
                />
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
        padding: 30
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
    }
});

export default Welcome;
