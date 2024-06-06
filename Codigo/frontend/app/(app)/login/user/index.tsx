import React, { useState, useEffect } from "react";
import { Text, View, TextInput, StyleSheet, Pressable, Alert, TouchableOpacity, Modal } from 'react-native';
import { loginUser } from "@/api/services/user";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import { Ionicons } from '@expo/vector-icons';
import LectorQr from "@/components/QRCodeScan"; // Asegúrate de que la ruta es correcta
import { router } from "expo-router";

const LogueoUsuarioManual = () => {
  const [dni, setDni] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isQrScannerVisible, setIsQrScannerVisible] = useState<boolean>(false);
  const [status, setStatusBoton] = useState<boolean>(false);


  const handleTerminar = async () => {
    const response = await loginUser(dni, password);
    if (response === 200) {
      Alert.alert(
        "Usuario logueado",
        "",
        [
          { text: "OK", onPress: () => router.navigate('/menu') }
        ]
      );
    } else {
      Alert.alert("Usuario no logueado",
        "DNI o contraseña incorrectos"
      );
    }
  };

  const handleQRCodeScanned = (data: string) => {
    //setDni(data); // Usa los datos del QR para llenar el DNI
    if (dni==data){
      setStatusBoton(true);
    }else{
      setStatusBoton(false);
    }
    setIsQrScannerVisible(false); // Oculta el escáner QR
  };

  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBackReg title='Login Manual de Usuario' route='menu' />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Dni:</Text>
          <TextInput
            placeholder='12345678'
            placeholderTextColor={"gray"}
            onChangeText={setDni}
            keyboardType="numeric"
            value={dni}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setIsQrScannerVisible(true)}>
            <Ionicons name="qr-code" size={30} color="white" style={{ alignSelf: "center" }} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Contraseña:</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder='Password'
              placeholderTextColor={"gray"}
              onChangeText={setPassword}
              value={password}
              secureTextEntry={!isPasswordVisible}
              style={styles.inputPassword}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={22} style={styles.icon} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Pressable disabled={!status} style={[styles.button, !status && styles.buttonMenuDisabled]} onPress={handleTerminar}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </Pressable>

      <Modal
        visible={isQrScannerVisible}
        animationType="slide"
        onRequestClose={() => setIsQrScannerVisible(false)}
      >
        <LectorQr onQRCodeScanned={handleQRCodeScanned} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000051',
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
    fontSize: 16,
    textAlign: "left",
    width: "30%",
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    flex: 1,
    borderRadius: 5,
    color: 'black',
  },
  passwordContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  inputPassword: {
    flex: 1,
    padding: 10,
    color: 'black',
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
  icon: {
    marginRight: 5
  },
  buttonMenuDisabled: {
    backgroundColor: '#a3a3a3',
  },
});

export default LogueoUsuarioManual;