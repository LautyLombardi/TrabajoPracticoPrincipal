import { View, Text, StyleSheet, Pressable, Alert, TextInput, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import HandleGoBackReg from '@/components/handleGoBack/HandleGoBackReg';
import Checkbox from 'expo-checkbox';
import { Categoria, Lugar } from '@/api/model/interfaces';
import { getLugares } from '@/api/services/place';
import { obtenerCategorias } from '@/api/services/categorias';
import SelectItem from '@/components/seleccionar/SelectItem';
import { createExcepcion } from '@/api/services/excepciones';

const Excepciones = () => {
  const [dni, setDni] = useState<string>("");
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  // Place
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [lugaresSeleccionados, setLugaresSeleccionados] = useState<number[]>([]);
  // Category
  const [categoriasName, setCategoriasName] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionadaName, setCategoriaSeleccionadaName] = useState<string>('');

  const handleLugarSeleccionado = (id: number) => {
    setLugaresSeleccionados((prevSeleccionados) =>
      prevSeleccionados.includes(id)
        ? prevSeleccionados.filter((lugarId) => lugarId !== id)
        : [...prevSeleccionados, id]
    );
  };

  const handleTerminar = async () => {    
    const category = categorias.find(categoria => {
      console.log(`Comparando: ${categoria.name} con ${categoriaSeleccionadaName}`);
      return categoria.name.trim().toLowerCase() === categoriaSeleccionadaName.trim().toLowerCase();
    });

    if (!isValidTime(duration)) {
      Alert.alert("Formato de hora no válido", "El formato debe ser hh:mm");
      return;
    }
    if (category) {
      await Promise.all(
        lugaresSeleccionados.map(async (lugar) => {
          await createExcepcion(parseInt(dni, 10), category.id, lugar, nombre, descripcion, duration);
        })
      );
      Alert.alert(
        "Excepción guardada",
        "",
        [
          { text: "OK", onPress: () => router.navigate("/excepciones") }
        ]
      );
    } else {
      console.error('Categoría no encontrada');
    }
  };

  const isValidTime = (time: any) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  };

  useEffect(() => {
    const fetchLugares = async () => {
      try {
        const lugaresData = await getLugares();
        setLugares(lugaresData);
      } catch (error) {
        console.error("Error al obtener los lugares:", error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const categoriasData = await obtenerCategorias();
        setCategorias(categoriasData);
        const nombresCategorias = categoriasData.map(categoria => categoria.name);
        setCategoriasName(nombresCategorias);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchLugares();
    fetchCategorias();
  }, []);

  return (
    <View style={styles.container}>
      {/** Header Menu */}
      {<HandleGoBackReg title='Registro Categoria' route='categorias' />}

      <View style={styles.formContainer}>
        <ScrollView>
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
            <Text style={styles.labelText}>Hora de Apertura:</Text>
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
            <Text style={[styles.campoText]}>Lugares a los que se le aplica la excepción</Text>
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
    backgroundColor: "#000051",
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
    alignItems: "center",
    marginTop: 20,
  },
  campoText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  lugaresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
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