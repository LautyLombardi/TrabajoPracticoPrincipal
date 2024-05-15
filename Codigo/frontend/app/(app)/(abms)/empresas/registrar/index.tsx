import React, { useState } from "react";
import { Text, View, TextInput } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Boton from "@/ui/Boton";
import CustomInputText from "@/components/registrar/CustomInputText";

const RegistroEmpresa = () => {
  const [dateIngreso, setDateIngreso] = useState(new Date());
  const [dateEgreso, setDateEgreso] = useState(new Date());
  const [Empresa, setEmpresa] = useState("");


  // Route
  const handleGoBack = () => {
    const canGoBack = router.canGoBack();
    if (canGoBack) {
      router.back();
    } else {
      router.navigate("/empresas");
    }
  };

  const handleTerminar = () => {
    router.navigate("/empresas")
  }

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
        <Text style={{ fontWeight: "bold" }}>Registro Empresa</Text>
      </View>



      <View style={{ flex: 1, marginTop: 20 }}>
        <CustomInputText label="Nombre" value="Fontanero" />
        <CustomInputText label="Descripcion" value="arregla cañeria" />        
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

export default RegistroEmpresa;