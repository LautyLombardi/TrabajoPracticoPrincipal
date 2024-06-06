import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable } from 'react-native';
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
      <View style={styles.formContainer}>
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

        <View style={styles.campo}>
          <Text style={[styles.campoText]}>Lugares a los que se asigna el Instituto:</Text>
          <View style={styles.lugaresContainer}>
            {lugares.map((lugar, index) => (
              <View key={lugar.id} style={styles.checkboxContainer}>
                <Checkbox
                  value={lugaresSeleccionados.includes(lugar.id)}
                  onValueChange={() => handleLugarSeleccionado(lugar.id)}
                />
                <Text style={styles.checkboxLabel}>{lugar.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <Pressable onPress={handleTerminar} style={styles.button}>
        <Text style={styles.buttonText}>Registrar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#00759c",
    flex: 1,
    paddingVertical: 30,
    alignItems: "center",
  },
  formContainer: {
    flex: 1,
    marginTop: 20,
    width: '90%',
  },
  campo: {
    flexDirection: 'column',
    marginTop: 20,
  },
  campoText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: '3%',
    marginLeft:'1%'
  },
  lugaresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginLeft:'10%'
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: '48%',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: '2%',
    color: "white",
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#000051',
    fontSize: 16,
  },
});

export default RegistroInstituto;