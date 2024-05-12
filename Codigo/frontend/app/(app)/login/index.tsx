import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';

const Login = () => {
  return (
    <View style={styles.container}>
        <Link href={"/menu"} asChild>
            <Pressable style={styles.button}>
                <Text style={styles.text}>
                    Autenticar
                </Text>
            </Pressable>
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

export default Login