import React from "react";
import { View, StyleSheet } from "react-native";
import Boton from "@/ui/Boton";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

const Login = () => {
  const navigator = useRouter();

  const handleAuterizar = async () => {
    try {
      // Simulación de la lógica de autenticación exitosa
      Alert.alert("AUTENTICACION EXITOSA: ");
      navigator.navigate("/menu");
    } catch (error) {
      Alert.alert("Error al autenticar usuario: ");
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          flex: 1,
          marginBottom: 20,
          width: "100%",
          alignSelf: "center",
          alignItems: "center",
        }}
      >
        <Boton
          text="Autenticar"
          styleText={styles.text}
          style={styles.button}
          onPress={handleAuterizar}
          hoverColor="#000000aa"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  button: {
    backgroundColor: "#000b",
    width: 300,
    padding: 20,
    borderRadius: 12,
  },

  text: {
    color: "#fff",
    textAlign: "center",
  },
});

export default Login;
