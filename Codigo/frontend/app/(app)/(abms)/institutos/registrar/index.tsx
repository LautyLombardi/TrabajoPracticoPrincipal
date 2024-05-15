import React, { useState } from "react";
import { Text, View, TextInput } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Boton from "@/ui/Boton";
import CustomInputText from "@/components/registrar/CustomInputText";
import Header from "@/ui/Header";
import SelectItem from "@/components/seleccionar/SelectItem";
import LugaresCheckBox from "@/components/lugaresCheckBox/LugaresCheckBox";

const ejemploLugares = ["mod1", "mod2", "mod3", "mod4"]

const RegistroInstituto = () => {
  const [nombreInstituto, setNombreInstituto] = useState("");
  const [lugaresSeleccionados, setLugaresSeleccionados] = useState<string[]>([])

  //         Route
  const handleGoBack = () => {
    const canGoBack = router.canGoBack();
    console.log(canGoBack)
    if (canGoBack) {
      router.back();
    } else {
      router.navigate("/institutos");
    }
  };

  const handleTerminar = () => {
    router.navigate("/institutos")
  }

  // ----------------------------

  const handleLugarToggle = (lugar: string) => {
    const isSelected = lugaresSeleccionados.includes(lugar);
    if (isSelected) {
      setLugaresSeleccionados(
        lugaresSeleccionados.filter((item) => item !== lugar)
      );
    } else {
      setLugaresSeleccionados([...lugaresSeleccionados, lugar]);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#000051",
        flex: 1,
        alignItems: "center",
        paddingBottom: 20
      }}
    >
    {/** HEADER */}
      <Header
        title="Registro de Instituto"
        handleGoBack={handleGoBack}
      />

    {/**Institos a registrar --> nombre, descripcion, lugares */}
      <View style={{ flex: 1, marginTop: 20, width: "100%" }}>
        <CustomInputText label="Nombre" value="ICI" />
      
        <View
              style={{
                width: "100%",
                justifyContent: "flex-start",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 15, color: "white" }}>
                  Lugares seleccionados: {lugaresSeleccionados.join(", ")}
                </Text>
              </View>
              <LugaresCheckBox
                lugares={ejemploLugares}
                lugaresSeleccionados={lugaresSeleccionados}
                onLugarToggle={handleLugarToggle}
              />
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

export default RegistroInstituto;