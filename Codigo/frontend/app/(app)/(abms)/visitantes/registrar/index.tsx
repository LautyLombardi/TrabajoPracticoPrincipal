import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import CampoFecha from "@/components/CampoFecha/CampoFecha";
import Boton from "@/ui/Boton";
import SelectItem from "@/components/seleccionar/SelectItem";
import { createVisitante } from "@/api/services/visitantes";
import { obtenerCategorias } from "@/api/services/categorias";
import { Categoria, Empresa } from "@/api/model/interfaces";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import { getEmpresas } from "@/api/services/empresa";
import { Ionicons } from "@expo/vector-icons";

const RegistroVisitante = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); 
  const [dateIngreso, setDateIngreso] = useState(new Date());
  const [dateEgreso, setDateEgreso] = useState(new Date());
  const [categoriasName, setCategoriasName] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionadaName, setCategoriaSeleccionadaName] = useState<string>('');
  const [empresasName, setEmpresasName] = useState<string[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaSeleccionadaName, setEmpresaSeleccionadaName] = useState<string>('');

  const handleTerminar = async () => {
    try {
      const empresa = empresas.find(empresa => empresa.name.trim().toLowerCase() === empresaSeleccionadaName.trim().toLowerCase());
      const categoria = categorias.find(categoria => categoria.name.trim().toLowerCase() === categoriaSeleccionadaName.trim().toLowerCase());

      if (empresa && categoria) {
        const response = await createVisitante(
          parseInt(dni),
          empresa.id,
          categoria.id,
          nombre,
          apellido,
          email,
          password,
          dateIngreso,
          dateEgreso
        );
        if(response === 201){
          Alert.alert(
            "Visitante guardado",
            "",
            [
              { text: "OK", onPress: () => router.navigate("/visitantes") }
            ]
          );
        } else {
          Alert.alert("Error al guardar visitante");
        }
      } else {
        if (!empresa) {
          Alert.alert("Empresa no encontrada.");
        }
        if (!categoria) {
          Alert.alert("Categoría no encontrada.");
        }
      }
    } catch (error) {
      console.error("Error en createVisitante:", error);
    }
  };


  useEffect(() => {
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

    const fetchEmpresas = async () => {
      try {
        const empresasData = await getEmpresas();
        setEmpresas(empresasData);
        const nombresEmpresas = empresasData.map(empresa => empresa.name);
        setEmpresasName(nombresEmpresas);
      } catch (error) {
        console.error("Error al obtener las empresas:", error);
      }
    };

    fetchEmpresas();
    fetchCategorias();
  }, []);

  return (
    <View style={styles.container}>
      {<HandleGoBackReg title='Registro Visitante' route='visitantes' />}
        
      <ScrollView style={styles.formContainer}>
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
          <Text style={styles.labelText}>DNI: </Text>
          <TextInput
            style={styles.input}
            placeholder='00000000'
            placeholderTextColor="gray"
            onChangeText={setDni}
            value={dni}
            keyboardType="numeric"
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
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Contraseña:</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder='Password'
              placeholderTextColor="gray"
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
        <View style={styles.inputContainer}>
          <SelectItem
            fieldName="Categoria"
            value={categoriaSeleccionadaName}
            onValueChange={setCategoriaSeleccionadaName}
            values={categoriasName}
          />
        </View>
        <View style={styles.inputContainer}>
          <SelectItem
            fieldName="Empresa"
            value={empresaSeleccionadaName}
            onValueChange={setEmpresaSeleccionadaName}
            values={empresasName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Fecha de Ingreso:</Text>
          <View style={{ flex: 1 }}>
            <CampoFecha date={dateIngreso} setDate={setDateIngreso} />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Fecha de Egreso:</Text>
          <View style={{ flex: 1 }}>
            <CampoFecha date={dateEgreso} setDate={setDateEgreso} />
          </View>
        </View>
        <View style={{ width: 300 }}>
          <Boton
            backgroundColor="black"
            padding={20}
            text="Continuar"
            color="white"
            textAlign="center"
            fontSze={20}
            borderRadius={10}
            onPress={handleTerminar}
          />
        </View>
      </ScrollView>
    </View>
  );
};

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
    marginRight: 5,
  },
});

export default RegistroVisitante;
