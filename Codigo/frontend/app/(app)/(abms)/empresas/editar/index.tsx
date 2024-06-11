import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { router, useLocalSearchParams } from "expo-router";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import useInsertLogAdm from '@/hooks/logs/userInsertLogAdm';
import useInsertLogAdmFail from '@/hooks/logs/userInsertLogAdmFail';
import useGetEnterprice from "@/hooks/enterprice/useGetEnterprice";
import useEditEnterprice from "@/hooks/enterprice/useEditEnterprice";

const RegistroEmpresa = () => {
  const { id } = useLocalSearchParams();
  const [nombre, setNombre] = useState<string>("");
  const [cuit, setCuit] = useState<string>();
  const getEnterprice = useGetEnterprice();
  const editEnterprice = useEditEnterprice();
  const insertLogAdm= useInsertLogAdm()
  const insertLogAdmFail= useInsertLogAdmFail()

  useEffect(() => {
    const fetchEnterprice = async () => {
      const enterprice = await getEnterprice(Number(id));
      if (enterprice && enterprice.name !== nombre) {
        setNombre(enterprice.name);
        setCuit(enterprice.cuit.toString())
      }
    };    
    fetchEnterprice();
  }, [id, getEnterprice]);
  

  const handleTerminar = async () => {
    if(nombre && cuit){
      const edit = await editEnterprice(Number(id), nombre, cuit);
      if(edit === 0){
        await insertLogAdmFail("MODIFICACIÓN","Empresa") 
        Alert.alert("Error al modificar Empresa");
      } else {
        await insertLogAdm("MODIFICACIÓN","Empresa") 

        Alert.alert(
          "Empresa modificado",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/empresas") }
          ]
        );
      }
    }    
  }
  

  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBackReg title="Edicion de Empresa" route="empresas" />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Nombre:</Text>
            <TextInput 
                placeholder='Santandar' 
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
          <View style={{ width: 80 }}>


        {/* <View style={styles.campo}>
          <Text style={[styles.campoText]}>Lugares a los que se asigna el Instituto:</Text>
          <View style={styles.lugaresContainer}>
            {lugares.map((lugar, index) => (
              <View key={lugar.id} style={styles.checkboxContainer}>
                <Checkbox
                  value={lugaresSeleccionados.includes(lugar.id)}
                  onValueChange={() => handleLugarSeleccionado(lugar.id)}
                />
                <Text style={styles.checkboxLabel}>{lugar.name}</Text>
              </View>
            ))}
          </View>
        </View> */}
      </View>

      <Pressable onPress={handleTerminar} style={styles.button}>
        <Text style={styles.buttonText}>Editar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#00759c",
    flex: 1,
    paddingVertical: 30,
    alignItems: "center",
  },
  formContainer: {
    flex: 1,
    marginTop: 20,
    width: '90%',
  },
  campo: {
    flexDirection: 'column',
    marginTop: 20,
  },
  campoText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: '3%',
    marginLeft:'1%'
  },
  lugaresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginLeft:'10%'
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: '48%',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: '2%',
    color: "white",
  },
  inputContainer: {
    height: 70,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20, 
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
  },
  labelText: {
    color: "white",
    fontSize: 18,
    textAlign: "left",
    width: "30%",
  },
  buttonText: {
    color: '#000051',
    fontSize: 16,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    flex: 1,
    borderRadius: 5,
    color: 'black',
  },
});

export default RegistroEmpresa;