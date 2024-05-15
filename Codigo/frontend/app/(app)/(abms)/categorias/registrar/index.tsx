import React, { useState } from "react";
import { Text, View } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Boton from "@/ui/Boton";
import CustomInputText from "@/components/registrar/CustomInputText";
import SelectItem from "@/components/seleccionar/SelectItem";

const RegistroCategoria = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [extern,setExtern] = useState(0)

  const handleSetCategoria = (cate: string) => {
    setCategoria(cate)
    if(cate == "interno"){
      setExtern(0)
    }else {
      setExtern(1)
    }
  } 

  // Route
  const handleGoBack = () => {
    const canGoBack = router.canGoBack();
    if (canGoBack) {
      router.back();
    } else {
      router.navigate("/categorias");
    }
  };

  const handleTerminar = async () => {
    try {
      const url = 'http://192.168.1.44:5000/category/';
      const data = {
        name: nombre,
        description: descripcion,
        isExtern: 0
      };
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error('Error al registrar la categoría');
      }
  
      // Navegar de regreso a la pantalla de categorías
      router.navigate("/categorias");
    } catch (error) {
      console.error('Error al registrar la categoría:', error);
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
        <Text style={{ fontWeight: "bold" }}>Registro Categoria</Text>
      </View>

      <View style={{ flex: 1, marginTop: 20 }}>
        <CustomInputText label="Nombre" value={nombre} onChangeText={setNombre} />
        <CustomInputText label="Descripcion" value={descripcion} onChangeText={setDescripcion} />
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
          <SelectItem value={categoria} onValueChange={handleSetCategoria} fieldName="Categoria" values={["interno", "externo"]} />
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