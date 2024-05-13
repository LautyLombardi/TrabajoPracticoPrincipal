import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'

const Welcome = () => {
  return (       
    <View style={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={styles.title}>MSS</Text>
        </View>


        <Link href={"/login"} asChild>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>
                    Iniciar Sesion
                </Text>
            </TouchableOpacity>
        </Link>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000051',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 30
    },

    button: {
        backgroundColor: "#000b",
        width: "80%",
        padding: 20,
        borderRadius: 12,
    },

    text: {
        color: "#fff",
        textAlign: "center",
    },

    titleContainer: {
       flex: 1,
       justifyContent: "center"
    },

    title: {
        color: "white",
        fontWeight: "bold",
        fontSize: 30,
    }
});

export default Welcome