import React, { useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet, Alert, Pressable } from 'react-native';
import { router } from "expo-router";
import SelectItem from "@/components/seleccionar/SelectItem";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import useInsertCategory from "@/hooks/category/useInsertCategory";
import { Lugar } from "@/api/model/interfaces";
import useGetPlaces from "@/hooks/place/useGetPlaces";
import Checkbox from "expo-checkbox";
import useInsertLogAdm from '@/hooks/logs/userInsertLogAdm';
import useInsertLogAdmFail from '@/hooks/logs/userInsertLogAdmFail';

const RegistroCategoria = () => {

  const placesDB = useGetPlaces();
  const insertLogAdm= useInsertLogAdm()
  const insertLogAdmFail= useInsertLogAdmFail()

  const insertCategory = useInsertCategory()
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [lugares, setLugares] = useState<Lugar[]>([])
  const [lugaresSeleccionados, setLugaresSeleccionados] = useState<number[]>([]);
  const [isExtern,setIsExtern] = useState(0)

  const handleSetCategoria = (cate: string) => {
    setCategoria(cate)
    if(cate == "interno"){
      setIsExtern(0)
    }else {
      setIsExtern(1)
    }
  } 

  // Comportamiento Terminar
  const handleTerminar = async () => {
    if(nombre && descripcion && lugaresSeleccionados.length > 0){
      const insert = await insertCategory(nombre, descripcion, isExtern, lugaresSeleccionados);
      if (insert === 0) {
        await insertLogAdmFail("ALTA","categoria")
        Alert.alert("Error al guardar categoria");
      } else if(insert === -1){
      await insertLogAdmFail("ALTA","categoria")
      Alert.alert("La categoria ya existe");
    } else {
        await insertLogAdm("ALTA","categoria")
        Alert.alert(
          "Categoria guardada",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/categorias") }
          ]
        );      
      }
    } else if (!nombre) {
      await insertLogAdmFail("ALTA", "categoria");
      Alert.alert("Error al crear categoria","Se debe ingresar un nombre para el categoria");
    }else if (!descripcion) {
      await insertLogAdmFail("ALTA", "categoria");
      Alert.alert("Error al crear categoria","Se debe ingresar un descripcion para el categoria");
    }else if (lugaresSeleccionados.length === 0) {
      await insertLogAdmFail("ALTA", "categoria");
      Alert.alert("Error al crear categoria","Se debe de seleccionar algun lugar");
    }
  }
  const handleLugarSeleccionado = (id: number) => {
    setLugaresSeleccionados((prevSeleccionados) =>
      prevSeleccionados.includes(id)
        ? prevSeleccionados.filter((lugarId) => lugarId !== id)
        : [...prevSeleccionados, id]
    );
  };

  useEffect(() => {
    const fetchLugares = async () => {
      const {places}=placesDB
      if (places) {
        setLugares(places);
      }
    };
    fetchLugares();    
  }, [placesDB])
  
  return (
    <View style={styles.container}>
      {/** Header Menu */}
      {<HandleGoBackReg title='Registro Categoria' route='categorias' />}

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Nombre:</Text>
          <TextInput
            placeholder='Categoria'
            placeholderTextColor={"gray"}
            onChangeText={setNombre}
            value={nombre}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Descripción:</Text>
          <TextInput
            placeholder='Descripción de la categoria'
            placeholderTextColor={"gray"}
            onChangeText={setDescripcion}
            value={descripcion}
            style={styles.input}
          />
        </View>
        {/** Seleccionar la categoria */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            padding: 10,
            gap: 10,
          }}
        >
          <SelectItem value={categoria} onValueChange={handleSetCategoria} fieldName="Categoria:" values={["interno", "Externo"]} />
        </View>


        <View style={styles.campo}>
          <Text style={[styles.campoText]}>Lugares a los que se asigna la Categoria:</Text>
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
});

export default RegistroCategoria;