import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'

const Welcome = () => {
  return (       
    <View style={styles.container}>
        

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
    }
});

export default Welcome