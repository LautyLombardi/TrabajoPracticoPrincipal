import React, { useState } from "react";
import { Text, View } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Boton from "@/ui/Boton";
import CustomInputText from "@/components/registrar/CustomInputText";
import SelectItem from "@/components/seleccionar/SelectItem";

const RegistroCategoria = () => {
  const [categoria, setCategoria] = useState("");

  // Route
  const handleGoBack = () => {
    const canGoBack = router.canGoBack();
    if (canGoBack) {
      router.back();
    } else {
      router.navigate("/categorias");
    }
  };

  const handleTerminar = () => {
    router.navigate("/categorias")
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
        <Text style={{ fontWeight: "bold" }}>Registro Categoria</Text>
      </View>



      <View style={{ flex: 1, marginTop: 20 }}>
        <CustomInputText label="Nombre" value="Fontanero" />
        <CustomInputText label="Descripcion" value="arregla cañeria" />
        {/** Seleccionar la categoria */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            padding: 10,
            gap: 10,
          }}
        >
          <SelectItem value={categoria} onValueChange={setCategoria} fieldName="Categoria" values={["interno", "externo"]} />
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
                
    </View>
  );
};

export default RegistroCategoria;