import React, { useState } from "react";
import { Text, View, Pressable, TextInput, Platform, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import CampoFecha from "@/components/CampoFecha/CampoFecha";
import Boton from "@/ui/Boton";
import SelectItem from "@/components/seleccionar/SelectItem";
import LugaresCheckBox from "@/components/lugaresCheckBox/LugaresCheckBox";
import { CameraView } from "expo-camera";
import SeleccionarImagen from "@/components/pickers/SeleccionarImagen";

const Fila = ({ label, value }: any) => {
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
        <TextInput placeholder={value} placeholderTextColor={"gray"} />
      </View>
    </View>
  );
};

const RegistroRoles = () => {
  const [dateIngreso, setDateIngreso] = useState(new Date());
  const [dateEgreso, setDateEgreso] = useState(new Date());
  const [Roles, setRoles] = useState("");

  const [showNext, setShowNext] = useState(false);

  // Route
  const handleGoBack = () => {
    const canGoBack = router.canGoBack();
    if (canGoBack) {
      router.back();
    } else {
      router.navigate("/roles");
    }
  };

  const handleContinuar = () => {
    setShowNext(true);
  };

  const handleRetroceder = () => {
    setShowNext(false);
  };

  const handleTerminar = () => {
    router.navigate("/roles")
  }

  // Segunda parte
  const [lugaresSeleccionados, setLugaresSeleccionados] = useState<string[]>(
    []
  );
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


  // tERCERA PARTE
  const [showCamera, setShowCamera] = useState(false)

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



      <View style={{ flex: 1, marginTop: 20 }}>
        <Fila label="Nombre" value="Profesor" />
        <Fila label="Descripcion" value="Enseña matematicas" />
        {/** Seleccionar la Roles */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            padding: 10,
            gap: 10,
          }}
        >
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

export default RegistroRoles;