import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable, Alert, TouchableOpacity, Modal } from 'react-native';
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import { Ionicons } from '@expo/vector-icons';
import LectorQr from "@/components/QRCodeScan";
import { router } from "expo-router";
import useLogin from "@/hooks/user/useLogin";
import useInsertLoginLogFail from "@/hooks/logs/useInsertLoginLogFail";
import useInsertLoginLog from "@/hooks/logs/useInsertLoginLog";
import { getAdmDni } from "@/api/services/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useFaceRecognitionUser from "@/hooks/user/useFaceRecognitionUser";
import { Usuario } from "@/api/model/interfaces";
import AdmUserModal from "@/components/Modal/AdmUserModal";

const Manual = () => {
  const getFaceRecognitionUser = useFaceRecognitionUser();
  const insertLoginLog=useInsertLoginLog();
  const insertLoginLogFail= useInsertLoginLogFail();
  const loginHook= useLogin();

  const [dni, setDni] = useState<string>('');
  const [usuario, setUsuario] = useState<Usuario>();
  const [showUser, setShowUser] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isQrScannerVisible, setIsQrScannerVisible] = useState<boolean>(false);
  const [status, setStatusBoton] = useState<boolean>(false);

  useEffect(()=> {
    setDni("");
    setPassword("");
  },[])

  const handleCloseUserModal = () => {
    setShowUser(false);
    router.navigate("/menu")
  };

  const handleTerminar = async() => {
    await AsyncStorage.removeItem('adm_data');
    console.log('autenticando.....')
    if(dni && password){
      const user=await loginHook(Number(dni),password);
      console.log("user es ",user)
      if (user === 1) {
        insertLoginLog(Number(dni),Number(dni),"Usuario")
        const adm_data = [{ adm_dni: dni }];                      
        await AsyncStorage.setItem('adm_data', JSON.stringify(adm_data));
        const user = await getFaceRecognitionUser(parseInt(dni));
        console.log("user es ",user)
        if(user){
          setUsuario(user);
          setShowUser(true);
        }
        setStatusBoton(false);
      } else if (user === 0) {
        await insertLoginLogFail(Number(dni),Number(dni),"Usuario")
        Alert.alert("Usuario no autenticado",
          "DNI o contraseña incorrectos"
        );
        setStatusBoton(false);
      }
    } else {
      await insertLoginLogFail(Number(dni),Number(dni),"Usuario")
      Alert.alert("Error al cargar datos"
      );
      setStatusBoton(false);
    }
  };


  const handleQRCodeScanned = (data: string) => {
    if (dni == data && password != null) {
      setDni(data)
      setStatusBoton(true);
    } else {
      setStatusBoton(false);
    }
    setIsQrScannerVisible(false); // Oculta el escáner QR
  };

  return (
    <View style={styles.container}>
      <HandleGoBackReg title='Autenticación Manual de Usuario' route='(app)' />

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

      <Pressable disabled={!status} style={[styles.button, (!status) && styles.buttonMenuDisabled]} onPress={handleTerminar}> 
        <Text style={styles.buttonText}>Autenticar</Text>
      </Pressable>

      <Modal
        visible={isQrScannerVisible}
        animationType="slide"
        onRequestClose={() => setIsQrScannerVisible(false)}
      >
        <LectorQr onQRCodeScanned={handleQRCodeScanned} />
      </Modal>

      {showUser && usuario && <AdmUserModal user={usuario} handleCloseModal={handleCloseUserModal} />}

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

export default Manual;
