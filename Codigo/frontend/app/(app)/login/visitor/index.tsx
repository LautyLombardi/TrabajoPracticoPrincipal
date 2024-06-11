import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { router } from "expo-router";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import useLogin from "@/hooks/visitor/useLogin";
import { getAdmDni } from "@/api/services/storage";
import useInsertLoginLog from "@/hooks/logs/useInsertLoginLog";
import useInsertLoginLogFail from "@/hooks/logs/useInsertLoginLogFail";

const LogueoVisitanteManual = () => {
  const [dni, setDni] = useState<string>("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const insertLoginLog=useInsertLoginLog();
  const insertLoginLogFail= useInsertLoginLogFail();
  const loginHook= useLogin();

  useEffect(()=> {
    setDni("");
    setNombre("");
    setApellido("");
    setEmail("");
  },[])

  const handleTerminar = async () => {
    console.log('autenticando.....')
    const admDni=await getAdmDni();
    if(admDni){
      if (dni && nombre && apellido && email) {
        const visitor=await loginHook(Number(dni),nombre,apellido,email);
        if (visitor === 1) {
          insertLoginLog(admDni,Number(dni),"Visitante")
          Alert.alert(
            "Visitante autenticado",
            "",
            [
              { text: "OK", onPress: () => router.navigate("/menu") }
            ]
          );
        } else {
          await insertLoginLogFail(admDni,Number(dni),"Visitante")
          Alert.alert("Visitante no autenticado",
            "DNI, nombre, apellido o email incorrectos"
          );
        }
      } else {
        await insertLoginLogFail(admDni,Number(dni),"Visitante")
        Alert.alert("Error al cargar datos");
      } 
    }
  };

  return (
    <View style={styles.container}>
      {/** Header Menu */}
      {<HandleGoBackReg title='Autenticación Manual de Visitante' route='menu' />}

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
          <Text style={styles.labelText}>Nombre:</Text>
          <TextInput
            style={styles.input}
            placeholder='Jose'
            placeholderTextColor="gray"
            onChangeText={setNombre}
            value={nombre}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Apellido:</Text>
          <TextInput
            style={styles.input}
            placeholder='Perez'
            placeholderTextColor="gray"
            onChangeText={setApellido}
            value={apellido}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder='example@example.com'
            placeholderTextColor="gray"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
          />
        </View>
      </View>

      <Pressable onPress={handleTerminar} style={styles.button}>
        <Text style={styles.buttonText}>Autenticar</Text>
      </Pressable>
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
  }
});

export default LogueoVisitanteManual;
