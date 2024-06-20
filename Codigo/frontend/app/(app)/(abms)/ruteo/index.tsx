import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import HandleGoBackReg from '@/components/handleGoBack/HandleGoBackReg';

const Ruteo = () => {
  const [ip, setIp] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTerminar = async () => {
    if (selectedImage === null) {
      Alert.alert("Seleccione un servidor.");
      return;
    }
    if (!isValidIP(ip)) {
      Alert.alert("Ingrese una IP valida.");
      return;
    }

    // Show the spinner
    setLoading(true);

    // SLEEP for 2 seconds
    await new Promise<void>(resolve => setTimeout(resolve, 2000));

    // Hide the spinner
    setLoading(false);

    Alert.alert(
      "Ruteo Realizado",
      "",
      [
        { text: "OK", onPress: () => router.navigate("/menu") }
      ]
    );
  };

  const isValidIP = (ip: string) => {
    const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = regex.exec(ip);
    if (!match) {
      return false; // No hay coincidencia con el formato de IP
    }
    for (let i = 1; i <= 4; i++) {
      const octet = parseInt(match[i]);
      if (octet < 0 || octet > 255) {
        return false; // Al menos un octeto está fuera del rango válido
      }
    }
    return true; // La IP cumple con el formato y el rango válido
  };

  return (
    <View style={styles.container}>
      <HandleGoBackReg title='Ruteo de conexión' route='menu' />

      <View style={styles.formContainer}>
        <View style={styles.imagesContainer}>
          <Pressable onPress={() => setSelectedImage(1)}>
            <Image
              source={require('../../../../assets/images/g-cloud.png')}
              style={[styles.logo, selectedImage === 1 && styles.selectedImage]}
            />
          </Pressable>
          <Pressable onPress={() => setSelectedImage(2)}>
            <Image
              source={require('../../../../assets/images/aws.png')}
              style={[styles.logo, selectedImage === 2 && styles.selectedImage]}
            />
          </Pressable>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Dirección IP:</Text>
          <TextInput
            placeholder='192.168.1.1'
            placeholderTextColor={"gray"}
            keyboardType='numeric'
            onChangeText={setIp}
            value={ip}
            style={styles.input}
          />
        </View>
      </View>

      <Pressable onPress={handleTerminar} style={styles.button}>
        <Text style={styles.buttonText}>Registrar</Text>
      </Pressable>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00759c',
    flex: 1,
    paddingVertical: 30,
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    marginTop: 20,
    width: '90%',
  },
  inputContainer: {
    height: 70,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  labelText: {
    color: "white",
    fontSize: 15,
    textAlign: "left",
    width: "30%",
    marginRight: 20, 
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    flex: 1,
    borderRadius: 5,
    color: 'black',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#000051',
    fontSize: 16,
  },
  imagesContainer: {
    marginTop:'10%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 300, 
    height: 250, 
    marginBottom: 20, 
  },
  selectedImage: {
    borderWidth: 2,
    borderColor: 'white',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Ruteo;