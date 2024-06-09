import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Alert, Pressable } from "react-native";
import { router } from "expo-router";
import SelectItem from "@/components/seleccionar/SelectItem";
import { Ionicons } from "@expo/vector-icons";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import useGetRolesData from "@/hooks/user/useGetRolData";  
import useInsertUser from "@/hooks/user/useInsertUser"; 
import { Rol } from "@/api/model/interfaces";
import useInsertLogAdm from "@/hooks/logs/userInsertLogAdm";
import useInsertLogAdmFail from "@/hooks/logs/userInsertLogAdmFail";



const RegistroUsuario = () => {
  const insertUser = useInsertUser();
  const { rolies, isLoading, isError } = useGetRolesData(); 
  const insertLogAdm= useInsertLogAdm()
  const insertLogAdmFail= useInsertLogAdmFail()


  
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [role, setRol] = useState<Rol[]>([]);
  const [rolesName, setRolesName] = useState<string[]>([]);
  const [rolesData, setRolesData] = useState<Rol[]>([]);
  const [rolSeleccionadoName, setRolSeleccionadoName] = useState<string>('');

  useEffect(() => {
    if (rolies) {
      setRol(rolies)
      const nombresRoles = rolies.map((rol: { name: any; }) => rol.name);
      setRolesName(nombresRoles);
    }
  }, [rolies]);

  const handleTerminar = async () => {
    try {
      // Normalizar nombres de roles para comparación
      const rol = role.find((rol: { name: string; }) =>
        rol.name.trim().toLowerCase() === rolSeleccionadoName.trim().toLowerCase()
      );
  
      if (rol) {
        const response = await insertUser(
          parseInt(dni),
          rol.id,
          nombre,
          apellido,
          password,
          new Date().toISOString()  // Fecha actual como fecha de activación
        );
        if (response !== 0) {
          const log= await insertLogAdm(123,"ALTA","usuario")

          Alert.alert(
            "Usuario guardado",
            "",
            [
              { text: "OK", onPress: () => router.navigate("/usuarios") }
            ]
          );
        } else {
          const log= await insertLogAdmFail(123,"ALTA","usuario")
          
          Alert.alert("Error al guardar usuario");
        }
      } else {
        Alert.alert("Rol no encontrado.");
      }
    } catch (error) {
      console.error("Error en createUsuario:", error);
    }
  };

  useEffect(() => {
    const { roles } = rolesDB;

    if (roles && roles !== rolesData) {
      setRolesData(roles);
      const nombresRoles = roles.map(role => role.name);
      setRolesName(nombresRoles);
    }
  }, [rolesDB, rolesData]);

  return (
    <View style={styles.container}>
      <HandleGoBackReg title='Registro Usuarios' route='usuarios' />
        
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
  icon: {
    marginRight: 5,
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

export default RegistroUsuario;
