import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import HandleGoBackReg from '@/components/handleGoBack/HandleGoBackReg';
import { TextInput } from 'react-native-gesture-handler';
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
    const category = categorias.find(categoria => categoria.name === categoriaSeleccionadaName);
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
        const nombresLugares = lugaresData.map(lugar => lugar.name);
        setLugares(lugaresData);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
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
        <View style={styles.inputRow}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Nombre</Text>
          </View>
          <View style={styles.textInputContainer}>
            <TextInput 
              placeholder='Example' 
              placeholderTextColor={"gray"} 
              onChangeText={setNombre} 
              value={nombre} 
              style={styles.input}
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Descripcion</Text>
          </View>
          <View style={styles.textInputContainer}>
            <TextInput 
              placeholder='Example' 
              placeholderTextColor={"gray"} 
              onChangeText={setDescripcion} 
              value={descripcion} 
              style={styles.input}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Hora de Apertura:</Text>
          <TextInput 
            placeholder='00:00' 
            placeholderTextColor={"gray"} 
            onChangeText={setDuration} 
            value={duration} 
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        {/** Seleccionar la categoria */}
        <View style={styles.selectContainer}>
          <SelectItem
            fieldName="Categoria"
            value={categoriaSeleccionadaName}
            onValueChange={setCategoriaSeleccionadaName}
            values={categoriasName}
          />
        </View>
        
        {/** Seleccionar la lugares */}
        <View style={styles.campo}>
          <Text style={[styles.campoText, {flex: 1}]}>Lugares a los que se le aplica la excepción</Text>
          {lugares.map((lugar) => (
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
  inputRow: {
    height: 70,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  labelContainer: {
    width: "23%",
  },
  textInputContainer: {
    backgroundColor: "white",
    padding: 12,
    flex: 1,
    borderRadius: 5,
    marginRight: 10,
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 10,
    gap: 10,
  },
  campo: {
    flexDirection: 'column',
    flex: 1,
    alignItems: "center",
  },
  campoText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    marginLeft: '2%',
    marginBottom: '2%',
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
