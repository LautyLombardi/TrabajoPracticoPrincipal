import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import Boton from "@/ui/Boton";
import SelectItem from "@/components/seleccionar/SelectItem";
import { Rol } from "@/api/model/interfaces";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import { Ionicons } from "@expo/vector-icons";
import { obtenerRoles } from "@/api/services/roles";
import { createUsuario } from "@/api/services/user";

const RegistroVisitante = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); 
  // future role
  const [rolesName, setRolesName] = useState<string[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [rolSeleccionadoName, setRolSeleccionadoName] = useState<string>('');

  const handleTerminar = async () => {
    try {
      const rol = roles.find(rol => rol.name.trim().toLowerCase() === rolSeleccionadoName.trim().toLowerCase());

      if (rol) {
        const response = await createUsuario(
          parseInt(dni),
          rol.id,
          nombre,
          apellido,
          password
        );
        if(response === 201){
          Alert.alert(
            "Usuario guardado",
            "",
            [
              { text: "OK", onPress: () => router.navigate("/usuarios") }
            ]
          );
        } else {
          Alert.alert("Error al guardar usuario");
        }
      } else {

        if (!rol) {
          Alert.alert("Rol no encontrada.");
        }
      }
    } catch (error) {
      console.error("Error en createUsuario:", error);
    }
  };


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await obtenerRoles();
        setRoles(rolesData);
        const nombresRoles = rolesData.map(role => role.name);
        setRolesName(nombresRoles);
      } catch (error) {
        console.error("Error al obtener los roles:", error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <View style={styles.container}>
      {<HandleGoBackReg title='Registro Usuarios' route='usuarios' />}
        
      <View style={styles.formContainer}>
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
            fieldName="Rol:"
            value={rolSeleccionadoName}
            onValueChange={setRolSeleccionadoName}
            values={rolesName}
          />
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
      </View>
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
