import React, { useEffect, useState } from "react";
import { Text, View, TextInput } from 'react-native';
import { router } from "expo-router";
import Boton from "@/ui/Boton";
import CustomInputText from "@/components/registrar/CustomInputText";
import Header from "@/ui/Header";
import LugaresCheckBox from "@/components/lugaresCheckBox/LugaresCheckBox";
import { createInstituto } from "@/api/services/institutos";
import { getLugares } from "@/api/services/place";
import { Lugar } from "@/api/model/interfaces";
import SelectItem from "@/components/seleccionar/SelectItem";

const ejemploLugares = ["mod1", "mod2", "mod3", "mod4"]

const RegistroInstituto = () => {
  const [nombre, setNombre] = useState<string>("");
  const [lugares, setLugares] = useState<Lugar[]>([])
  const [lugaresName, setLugaresName] = useState<string[]>([])
  const [lugaresSeleccionadoName, setLugaresSeleccionadoName] = useState<string>('')

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

  //TODO: continuar por acá
  const handleTerminar = async() => {
    //const respuesta = await createInstituto(instituto, lugaresId)
    router.navigate("/institutos")
  }

  useEffect(() => {
    const fetchLugares = async () => {
      try {
      const lugaresData = await getLugares();
      const nombresLugares = lugaresData.map(lugar => lugar.name);
      setLugaresName(nombresLugares)
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchLugares();    
  }, [])
  
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
        <View style={{ height: 70, alignItems: "center",flexDirection: "row", gap: 10, paddingHorizontal: 10,}}>
        <View style={{ width: 80 }}>
          <Text style={{ color: "white", fontSize: 15 }}>Instituto</Text>
        </View>
        <View style={{ backgroundColor: "white", padding: 10, flex: 2, borderRadius: 5,}}>
          <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="ICI"
              placeholderTextColor={"gray"}
            />
        </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", width: "100%", padding: 10, gap: 10 }}>
            <SelectItem
              fieldName="Lugar"
              value={lugaresSeleccionadoName}
              onValueChange={setLugaresSeleccionadoName}
              values={lugaresName}
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