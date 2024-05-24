import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet } from 'react-native';
import { router } from "expo-router";
import Boton from "@/ui/Boton";
import { Rol } from "@/api/model/interfaces";
import { crearRol } from "@/api/services/roles";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";

const Fila = ({ label, value, onChangeText }: any) => {
  return (
    <View
      style={{
        height: 70,
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: 10,
      }}
    >
      <View style={{ width: 80 }}>
        <Text style={{ color: "white", fontSize: 15 }}>{label}</Text>
      </View>
      <View
        style={{
          backgroundColor: "white",
          padding: 10,
          flex: 2,
          borderRadius: 5,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={label}
          placeholderTextColor={"gray"}
        />
      </View>
    </View>
  );
};

const RegistroRoles = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleTerminar = async () => {
    try {
      const respuesta = await crearRol(nombre, descripcion)
      router.navigate("/roles");
    } catch (error) {
      console.error('Error al crear el rol:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/** Header Menu */}
      {<HandleGoBackReg title='Registro Categoria' route='roles' />}

      <View style={{ flex: 1, marginTop: 20, width: "100%" }}>
        <Fila label="Nombre" value={nombre} onChangeText={setNombre} />
        <Fila label="Descripcion" value={descripcion} onChangeText={setDescripcion} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000051",
    flex: 1,
    paddingVertical: 30,
    alignItems: "center",
  },
});

export default RegistroRoles;
