import React, { useState } from "react";
import { Text, View, TextInput } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Boton from "@/ui/Boton";
import { Rol } from "@/api/model/interfaces";
import { crearRol } from "@/api/services/roles";

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

  // Route
  const handleGoBack = () => {
    const canGoBack = router.canGoBack();
    if (canGoBack) {
      router.back();
    } else {
      router.navigate("/roles");
    }
  };

  const handleTerminar = async () => {
    try {
      const respuesta = await crearRol(nombre, descripcion)
      router.navigate("/roles");
    } catch (error) {
      console.error('Error al crear el rol:', error);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#000051",
        flex: 1,
        paddingVertical: 30,
        alignItems: "center",
      }}
    >
      {/** HEADER */}
      <View
        style={{
          height: 50,
          backgroundColor: "white",
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: 10,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <Ionicons name="arrow-back-outline" size={20} onPress={handleGoBack} />
        <Text style={{ fontWeight: "bold" }}>Registro roles</Text>
      </View>

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

export default RegistroRoles;
