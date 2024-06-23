import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import HandleGoBackReg from '@/components/handleGoBack/HandleGoBackReg';
import { router } from 'expo-router';
import useInsertEnterprice from '@/hooks/enterprice/useInsertEnterprice';
import useInsertLogAdmFail from '@/hooks/logs/userInsertLogAdmFail';

const RegistrarEmpresa = () => {
  const insertEnterprice = useInsertEnterprice()
  const insertLogAdmFail= useInsertLogAdmFail()

  const [nombre, setNombre] = useState<string>("");
  const [cuit, setCuit] = useState<string>("");

  const handleTerminar = async () => {
    if (!nombre || !cuit) {
      Alert.alert("Campos incompletos", "Todos los campos son obligatorios.");
      return;
    }

    const cuitNumber = parseInt(cuit, 10); 
    if (!isNaN(cuitNumber)) {
      const response = await insertEnterprice(nombre, cuitNumber);
      if(response === 0){
        await insertLogAdmFail("ALTA","empresa")
        Alert.alert("Error al guardar empresa");
      }  else if (response === -1) {
        await insertLogAdmFail("ALTA", "empresa");
        Alert.alert("La empresa ya existe");
      }
      else {
        Alert.alert(
          "Empresa guardada",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/empresas") }
          ]
        );
      }
    } else {
      await insertLogAdmFail("ALTA","empresa")
      Alert.alert("CUIT no válido");
    }
  };

  return (
    <View style={styles.container}>
      <HandleGoBackReg title='Registro Empresa' route='empresas' />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Nombre:</Text>
          <TextInput 
            placeholder='Example' 
            placeholderTextColor={"gray"} 
            onChangeText={setNombre} 
            value={nombre} 
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Cuit:</Text>
          <TextInput 
            placeholder='20123456781' 
            placeholderTextColor={"gray"} 
            onChangeText={setCuit} 
            value={cuit} 
            keyboardType='numeric'
            style={styles.input}
          />
        </View>
      </View>

      <Pressable onPress={handleTerminar} style={styles.button}>
        <Text style={styles.buttonText}>Registrar</Text>
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
    fontSize: 18,
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
});

export default RegistrarEmpresa;
