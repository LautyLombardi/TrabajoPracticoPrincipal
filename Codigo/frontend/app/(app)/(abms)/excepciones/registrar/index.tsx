import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, TextInput, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import HandleGoBackReg from '@/components/handleGoBack/HandleGoBackReg';
import Checkbox from 'expo-checkbox';
import { Categoria, Lugar } from '@/api/model/interfaces';
import SelectItem from '@/components/seleccionar/SelectItem';
import useGetCategories from '@/hooks/category/useGetCategories';
import useGetPlaces from '@/hooks/place/useGetPlaces';
import useInsertException from '@/hooks/exception/useInsertException';

const Excepciones = () => {
  const placesDB =useGetPlaces();
  const categoriesDB = useGetCategories()
  const insertException = useInsertException()

  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [lugaresSeleccionados, setLugaresSeleccionados] = useState<number[]>([]);
  const [categoriasName, setCategoriasName] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionadaName, setCategoriaSeleccionadaName] = useState<string>('');

  const handleTerminar = async () => {    
    const category = categorias.find(categoria => {
      return categoria.name.trim().toLowerCase() === categoriaSeleccionadaName.trim().toLowerCase();
    });

    if (!isValidTime(duration)) {
      Alert.alert("Formato de hora no válido", "El formato debe ser hh:mm");
      return;
    }

    if (category) {
      const insert = await insertException(nombre, descripcion, duration, lugaresSeleccionados, category.id);
      if(insert === 0){
        // TODO: log
        Alert.alert("Error al guardar excepción");
      } else {
        // TODO: log
        Alert.alert(
          "Excepción guardada",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/excepciones") }
          ]
        );
      }
      
    } else {
      // TODO: log
      Alert.alert("Categoría no encontrada o no seleccionada");
      console.error('Categoría no encontrada o no seleccionada');
    }
  };

  const isValidTime = (time: any) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  };

  const handleLugarSeleccionado = (id: number) => {
    setLugaresSeleccionados((prevSeleccionados) =>
      prevSeleccionados.includes(id)
        ? prevSeleccionados.filter((lugarId) => lugarId !== id)
        : [...prevSeleccionados, id]
    );
  };

  useEffect(() => {
    const { categories } = categoriesDB;
    if (categories && categories.length > 0 && categorias.length === 0) {
      setCategorias(categories);
      const nombresCategorias = categories.map(categoria => categoria.name);
      setCategoriasName(nombresCategorias);
    }
  }, [categoriesDB.categories]);

  useEffect(() => {
    const { places } = placesDB;
    if (places && places.length > 0 && lugares.length === 0) {
      setLugares(places);
    }
  }, [placesDB.places]);
  
  return (
    <View style={styles.container}>
      {/** Header Menu */}
      {<HandleGoBackReg title='Registro Excepciones' route='excepciones' />}

      <View style={styles.formContainer}>
        <ScrollView>
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Nombre</Text>
            <TextInput 
              placeholder='Example' 
              placeholderTextColor={"gray"} 
              onChangeText={setNombre} 
              value={nombre} 
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Descripcion</Text>
            <TextInput 
              placeholder='Example' 
              placeholderTextColor={"gray"} 
              onChangeText={setDescripcion} 
              value={descripcion} 
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Duracion de la excepción:</Text>
            <TextInput 
              placeholder='00:00' 
              placeholderTextColor={"gray"} 
              onChangeText={setDuration} 
              value={duration} 
              style={styles.input}
            />
          </View>

          {/** Seleccionar la categoria */}
          <View style={styles.inputContainer}>
            <SelectItem
              fieldName="Categoria"
              value={categoriaSeleccionadaName}
              onValueChange={setCategoriaSeleccionadaName}
              values={categoriasName}
            />
          </View>
          
          {/** Seleccionar la lugares */}
          <View style={styles.campo}>
            <Text style={[styles.campoText]}>Lugares a los que se le aplica la excepción:</Text>
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
        </ScrollView>
      </View>

      {/** Enviar Excepcion al backend */}
      <Pressable onPress={handleTerminar} style={styles.button}>
        <Text style={styles.buttonText}>Registrar Excepcion</Text>
      </Pressable>
    </View>
  )
}

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
});

export default Excepciones;