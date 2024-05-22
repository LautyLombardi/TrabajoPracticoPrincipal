import React, { useState } from "react";
import { Text, TextInput, View } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Boton from "@/ui/Boton";
import SelectItem from "@/components/seleccionar/SelectItem";
import { crearCategoria } from "@/api/services/categorias";

const RegistroCategoria = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [isExtern,setIsExtern] = useState(0)

  const handleSetCategoria = (cate: string) => {
    setCategoria(cate)
    if(cate == "interno"){
      setIsExtern(0)
    }else {
      setIsExtern(1)
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

  // Comportamiento Terminar
  const handleTerminar = async () => {
    try {
      await crearCategoria(nombre, descripcion, isExtern);
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
        <View style={{height: 70, alignItems: "center",flexDirection: "row", gap: 10,}}>
          <View style={{ width: "23%" }}>
            <Text style={{ color: "white", fontSize: 15, textAlign: "center", textAlignVertical: "center" }}>Nombre</Text>
          </View>
          <View style={{ backgroundColor: "white",padding: 12,flex: 1,borderRadius: 5,marginRight: 10}}>
            <TextInput placeholder='Example' placeholderTextColor={"gray"} onChangeText={setNombre} value={nombre}/>
          </View>
        </View>
        <View style={{height: 70, alignItems: "center",flexDirection: "row", gap: 10,}}>
          <View style={{ width: "23%" }}>
            <Text style={{ color: "white", fontSize: 15, textAlign: "center", textAlignVertical: "center" }}>Descripcion</Text>
          </View>
          <View style={{ backgroundColor: "white",padding: 12,flex: 1,borderRadius: 5,marginRight: 10}}>
            <TextInput placeholder='Example' placeholderTextColor={"gray"} onChangeText={setDescripcion} value={descripcion}/>
          </View>
        </View>
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
          <SelectItem value={categoria} onValueChange={handleSetCategoria} fieldName="Categoria" values={["interno", "isExterno"]} />
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