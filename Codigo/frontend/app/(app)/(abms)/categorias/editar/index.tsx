import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { router, useLocalSearchParams } from "expo-router";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import useInsertLogAdm from '@/hooks/logs/userInsertLogAdm';
import useInsertLogAdmFail from '@/hooks/logs/userInsertLogAdmFail';
import useGetCategoryById from "@/hooks/category/useGetCategoryById";
import useEditCategory from "@/hooks/category/useEditCategory";

const RegistroCategoria = () => {
  const { id } = useLocalSearchParams();
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const getCategory = useGetCategoryById();
  const editCategory = useEditCategory();
  const insertLogAdm= useInsertLogAdm()
  const insertLogAdmFail= useInsertLogAdmFail()

  useEffect(() => {
    const fetchCategory = async () => {
      const category = await getCategory(Number(id));
      if (category && category.name !== nombre) {
        setNombre(category.name);
        setDescripcion(category.description)
      }
    };    
    fetchCategory();
  }, [id, getCategory]);
  

  const handleTerminar = async () => {
    if(nombre){
      const edit = await editCategory(Number(id), nombre, descripcion);
      if(edit === 0){
        await insertLogAdmFail("MODIFICACIÓN","Categoria") 
        Alert.alert("Error al modificar categoria");
      } else {
        await insertLogAdm("MODIFICACIÓN","Categoria") 

        Alert.alert(
          "Categoria modificada",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/categorias") }
          ]
        );
      }
    }    
  }
  

  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBackReg title="Edicion de Categoria" route="categorias" />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Nombre:</Text>
            <TextInput 
                placeholder='categoria' 
                placeholderTextColor={"gray"} 
                onChangeText={setNombre} 
                value={nombre} 
                style={styles.input}
          />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Descripcion:</Text>
            <TextInput 
            placeholder='arregla cosas' 
            placeholderTextColor={"gray"} 
            onChangeText={setDescripcion} 
            value={descripcion} 
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

  input: {
    backgroundColor: "white",
    padding: 10,
    flex: 1,
    borderRadius: 5,
    color: 'black',
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

});

export default RegistroCategoria;