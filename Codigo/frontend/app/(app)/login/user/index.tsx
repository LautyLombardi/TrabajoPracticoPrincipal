import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable, Alert, TouchableOpacity, Modal } from 'react-native';
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import { Ionicons } from '@expo/vector-icons';
import LectorQr from "@/components/QRCodeScan";
import { router } from "expo-router";
import useLogin from "@/hooks/user/useLogin";

const LogueoUsuarioManual = () => {
  const [dni, setDni] = useState<string>('');
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isQrScannerVisible, setIsQrScannerVisible] = useState<boolean>(false);
  const [status, setStatusBoton] = useState<boolean>(false);

  const { user, isLoading, isError } = useLogin(Number(dni), password);

  const handleTerminar = () => {
    console.log('autenticando.....')
    if(dni && password){
      if (user === 1) {
        // TODO: log await logLoginManual(dni.toString(),"usuario")
        Alert.alert(
          "Usuario autenticado",
          "",
          [
            { text: "OK", onPress: () => router.navigate('/menu') }
          ]
        );
      } else if (user === 0) {
        Alert.alert("Usuario no autenticado",
          "DNI o contraseña incorrectos"
        );
      } else if (user === 2) {
        Alert.alert("Usuario no autenticado",
          "Usuario no encontrado"
        );
      }
    } else {
      Alert.alert("Error al cargar datos"
      );
    }
  };

  const handleQRCodeScanned = (data: string) => {
    if (dni == data) {
      setStatusBoton(true);
    } else {
      setStatusBoton(false);
    }
    setIsQrScannerVisible(false); // Oculta el escáner QR
  };

  return (
    <View style={styles.container}>
      <HandleGoBackReg title='Autenticación Manual de Usuario' route='menu' />

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

        <TouchableOpacity onPress={() => setIsQrScannerVisible(true)} style={styles.qrButton}>
          <Ionicons name="qr-code" size={90} color="white" style={styles.scannerQR} />
        </TouchableOpacity>
      </View>

      {/* <Pressable disabled={!status || isLoading} style={[styles.button, (!status || isLoading) && styles.buttonMenuDisabled]} onPress={handleTerminar}> */}
      <Pressable disabled={isLoading} style={[styles.button, (isLoading) && styles.buttonMenuDisabled]} onPress={handleTerminar}>
        <Text style={styles.buttonText}>Autenticar</Text>
      </Pressable>

      <Modal
        visible={isQrScannerVisible}
        animationType="slide"
        onRequestClose={() => setIsQrScannerVisible(false)}
      >
        <LectorQr onQRCodeScanned={handleQRCodeScanned} />
      </Modal>

      {isError && <Text style={{ color: 'red' }}>Error al autenticar</Text>}
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
  scannerQR: {
    marginTop: '5%',
    alignSelf: "center"
  },
  qrButton: {
    alignItems: 'center',
    marginTop: 20
  }
});

export default LogueoUsuarioManual;
