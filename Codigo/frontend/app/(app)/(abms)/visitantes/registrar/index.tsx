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

const RegistroVisitante = () => {
  const [dateIngreso, setDateIngreso] = useState(new Date());
  const [dateEgreso, setDateEgreso] = useState(new Date());
  const [categoria, setCategoria] = useState("");

  const [showNext, setShowNext] = useState(false);

  // Route
  const handleGoBack = () => {
    const canGoBack = router.canGoBack();
    if (canGoBack) {
      router.back();
    } else {
      router.navigate("/visitantes");
    }
  };

  const handleContinuar = () => {
    setShowNext(true);
  };

  const handleRetroceder = () => {
    setShowNext(false);
  };

  const handleTerminar = () => {
    router.navigate("/visitantes")
  }

  // Segunda parte
  const [lugaresSeleccionados, setLugaresSeleccionados] = useState<string[]>(
    []
  );
  const ejemploLugares = ["2222", "mod3", "mod7"];
  const [imagen, setImagen] = useState<any>(null);

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
        <Text style={{ fontWeight: "bold" }}>Registro Visitante</Text>
      </View>

      {!showNext ? (
        <>
          <View style={{ flex: 1, marginTop: 20 }}>
            <Fila label="Nombre" value="Juan Carlos" />
            <Fila label="Apellido" value="Perez" />
            <Fila label="DNI" value="12345678" />
            <Fila label="Email" value="ejemplo@gmail.com" />
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
              <SelectItem value={categoria} onValueChange={setCategoria} />
            </View>

            {/** Fecha de Ingreso*/}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                padding: 10,
              }}
            >
              <View style={{ width: 90 }}>
                <Text style={{ color: "white", fontSize: 15 }}>
                  Fecha de Ingreso:{" "}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <CampoFecha date={dateIngreso} setDate={setDateIngreso} />
              </View>
            </View>

            {/** Fecha de Egreso */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                padding: 10,
              }}
            >
              <View style={{ width: 90 }}>
                <Text style={{ color: "white", fontSize: 15 }}>
                  Fecha de Egreso:{" "}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <CampoFecha date={dateEgreso} setDate={setDateEgreso} />
              </View>
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
              onPress={handleContinuar}
            />
          </View>
        </>
      ) : (
        <>
        <View style={{flex: 2, width: "100%", height:"100%"}}>

          {/** Subir archivo de Foto */}
          <View style={{flex: 1, alignItems: "center", justifyContent: "center", alignSelf: "center", gap: 10, marginVertical: 40}}>
            <SeleccionarImagen imagen={imagen} onChange={setImagen}/>
          </View>


          {/** Seleccionar los lugares */}
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

          {/** Botones de volver y continuar */}
          <View style={{ width: 300, gap: 10}}>
          <Boton
              backgroundColor="#f56e1ad2"
              padding={20}
              text="Volver"
              color="white"
              textAlign="center"
              fontSze={20}
              borderRadius={10}
              onPress={handleRetroceder}
            />

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
        </>
      )}


    </View>
  );
};

export default RegistroVisitante;
