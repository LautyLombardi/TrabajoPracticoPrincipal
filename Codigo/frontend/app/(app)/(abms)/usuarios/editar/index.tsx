import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Alert, Pressable } from "react-native";
import { router, useLocalSearchParams  } from "expo-router";
import SelectItem from "@/components/seleccionar/SelectItem";
import { Ionicons } from "@expo/vector-icons";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import { Rol } from "@/api/model/interfaces";
import useEditLogUserVisitorFail from "@/hooks/logs/useInsertEditLogAdmUserVisitoFail";
import useInsertEditUserVisitor from "@/hooks/logs/useInsertEditLogAdmUserVisitor";
import useGetRoles from "@/hooks/roles/useGetRoles";
import useGetUser from "@/hooks/user/useGetUser";
import useEditUser from "@/hooks/user/useEditUser";
import CampoFecha from "@/components/CampoFecha/CampoFecha";
import { parse } from "react-native-svg";

const EditarUsuario = () => {
  const { dni } = useLocalSearchParams();
  const { user, isLoading, isError } = useGetUser(Number(dni));

  useEffect(() => {
    // Aquí puedes usar el DNI para buscar los datos del usuario y rellenar el formulario de edición
    console.log('DNI del usuario:', dni);
  }, [dni]);

  useEffect(() => {
    if (user) {
      setNombreN(user.name);
      setApellidoN(user.lastname);
      setDniN(user.dni.toString());
    }
  }, [user]);

  const rolesDB = useGetRoles();
  const editUser = useEditUser();
  const insertLogEditUser = useInsertEditUserVisitor();
  const insertLogAdmEditUserFail = useEditLogUserVisitorFail();;
  const [nombreN, setNombreN] = useState("");
  const [apellidoN, setApellidoN] = useState("");
  const [dniN, setDniN] = useState("");
  const [motivo, setMotivo] = useState("");
  const [dateActive, setDateActive] = useState(new Date());
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [role, setRol] = useState<Rol[]>([]);
  const [rolesName, setRolesName] = useState<string[]>([]);
  const [rolSeleccionadoName, setRolSeleccionadoName] = useState<string>("");


  const handleTerminar = async () => {
    var roleID : number | undefined = 0;
    if(rolSeleccionadoName !==undefined){
      const rol = role.find((rol: { name: string }) =>
        rol.name.trim().toLowerCase() === rolSeleccionadoName.trim().toLowerCase()
      );
      roleID = rol?.id
    }

    if (user) {
      const response = await editUser(user, parseInt(dniN), nombreN, apellidoN, roleID, password, dateActive.toISOString());
      if (response !== 0) {
        await insertLogEditUser( "usuario", parseInt(dniN));
        Alert.alert(
          "Usuario modificado",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/usuarios") }
          ]
        );
      } else {
        await insertLogAdmEditUserFail("usuario", parseInt(dniN));
        Alert.alert("Error al guardar usuario");
      }
    } else {
      await insertLogAdmEditUserFail("usuario", parseInt(dniN));
      Alert.alert("Error al guardar usuario");
    }
  };

  useEffect(() => {
    const { roles } = rolesDB;

    if (roles && roles !== role) {
      setRol(roles);
      const nombresRoles = roles.map(role => role.name);
      setRolesName(nombresRoles);
      setRolSeleccionadoName(roles[0].name)
      
    }
  }, [rolesDB, role,rolSeleccionadoName]);

  return (
    <View style={styles.container}>
      <HandleGoBackReg title="Editar Usuarios" route="usuarios" />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Nombre:</Text>
          <TextInput
            style={styles.input}
            placeholder="Jose"
            placeholderTextColor="gray"
            onChangeText={setNombreN}
            value={nombreN}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Apellido:</Text>
          <TextInput
            style={styles.input}
            placeholder="Perez"
            placeholderTextColor="gray"
            onChangeText={setApellidoN}
            value={apellidoN}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>DNI: </Text>
          <TextInput
            style={styles.input}
            placeholder="00000000"
            placeholderTextColor="gray"
            onChangeText={setDniN}
            value={dniN}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Contraseña:</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="gray"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={!isPasswordVisible}
              style={styles.inputPassword}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={22} style={styles.icon} color="gray" />
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
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Motivo:</Text>
          <TextInput
            style={styles.input}
            placeholder="Motivo de edición"
            placeholderTextColor="gray"
            onChangeText={setMotivo}
            value={motivo}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Fecha de Activacion:</Text>
          <View style={{ flex: 1 }}>
            <CampoFecha date={dateActive} setDate={setDateActive} />
          </View>
        </View>
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

export default EditarUsuario;
