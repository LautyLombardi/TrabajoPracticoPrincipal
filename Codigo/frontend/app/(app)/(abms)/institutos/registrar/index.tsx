import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet } from 'react-native';
import { router } from "expo-router";
import Boton from "@/ui/Boton";
import { createInstituto } from "@/api/services/institutos";
import { getLugares } from "@/api/services/place";
import { Lugar } from "@/api/model/interfaces";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import Checkbox from "expo-checkbox";

const RegistroInstituto = () => {
  const [nombre, setNombre] = useState<string>("");
  const [lugares, setLugares] = useState<Lugar[]>([])
  const [lugaresName, setLugaresName] = useState<string[]>([])
  const [lugaresSeleccionadoName, setLugaresSeleccionadoName] = useState<string>('')
  const [lugaresSeleccionados, setLugaresSeleccionados] = useState<number[]>([]);

  const handleTerminar = async () => {
    if (lugaresSeleccionados.length > 0) {
      const respuesta = await createInstituto(nombre, lugaresSeleccionados);
      router.navigate("/institutos");
    } else {
      console.error("Debe seleccionar al menos un lugar");
    }
  };

  const handleLugarSeleccionado = (id: number) => {
    setLugaresSeleccionados((prevSeleccionados) =>
      prevSeleccionados.includes(id)
        ? prevSeleccionados.filter((lugarId) => lugarId !== id)
        : [...prevSeleccionados, id]
    );
  };

  useEffect(() => {
    const fetchLugares = async () => {
      try {
      const lugaresData = await getLugares();
      const nombresLugares = lugaresData.map(lugar => lugar.name);
      setLugaresName(nombresLugares)
      setLugares(lugaresData)
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchLugares();    
  }, [])
  
  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBackReg title="Registro de Instituto" route="institutos" />

      {/** Institutos a registrar --> nombre, descripcion, lugares */}
      <View style={{ flex: 1, marginTop: 20, width: "100%" }}>
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
            <Text style={{ color: "white", fontSize: 15 }}>Instituto</Text>
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
              value={nombre}
              onChangeText={setNombre}
              placeholder="ICI"
              placeholderTextColor={"gray"}
            />
          </View>
        </View>

        <View style={{ padding: 10 }}>
          <Text style={{ color: "white", fontSize: 15 }}>Lugares</Text>
          {lugares.map((lugar) => (
            <View key={lugar.id} style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                value={lugaresSeleccionados.includes(lugar.id)}
                onValueChange={() => handleLugarSeleccionado(lugar.id)}
              />
              <Text style={{marginLeft:'2%', marginBottom:'2%', color: "white" }}>{lugar.name}</Text>
            </View>
          ))}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000051",
    flex: 1,
    paddingVertical: 30,
    alignItems: "center",
  },
});

export default RegistroInstituto;