import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { router, useLocalSearchParams } from "expo-router";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import useInsertLogAdm from '@/hooks/logs/userInsertLogAdm';
import useInsertLogAdmFail from '@/hooks/logs/userInsertLogAdmFail';
import useGetInstitute from "@/hooks/institute/useGetInstitute";
import useEditInstitute from "@/hooks/institute/useEditInstitute";
import useGetPlaces from "@/hooks/place/useGetPlaces";
import { Lugar } from "@/api/model/interfaces";
import Checkbox from "expo-checkbox";

const EditarInstituto = () => {
  const { id } = useLocalSearchParams();
  const { places } = useGetPlaces();
  const getInstitute = useGetInstitute();
  const editInstitute = useEditInstitute();
  const insertLogAdm = useInsertLogAdm();
  const insertLogAdmFail = useInsertLogAdmFail();
  const [nombre, setNombre] = useState<string>("");
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [lugaresSeleccionados, setLugaresSeleccionados] = useState<number[]>([]);

  useEffect(() => {
    const fetchInstitute = async () => {
      const result = await getInstitute(Number(id));
      console.log('Fetched Institute:', result);
      if (result) {
        const { institute, placeIds } = result;
        if (institute && institute.name !== nombre) {
          setNombre(institute.name);
        }
        if (places) {
          setLugares(places);
        }
        if (placeIds) {
          setLugaresSeleccionados(placeIds);
        }
      }
    };
    fetchInstitute();
  }, [id, getInstitute, places]);

  const handleLugarSeleccionado = (id: number) => {
    setLugaresSeleccionados((prevSeleccionados) =>
      prevSeleccionados.includes(id)
        ? prevSeleccionados.filter((lugarId) => lugarId !== id)
        : [...prevSeleccionados, id]
    );
  };

  const handleTerminar = async () => {
    if (nombre && lugaresSeleccionados.length > 0) {
      const edit = await editInstitute(Number(id), nombre, lugaresSeleccionados);
      if (edit === 0) {
        await insertLogAdmFail("MODIFICACIÓN", "instituto");
        Alert.alert("Error al modificar instituto");
      } else {
        await insertLogAdm("MODIFICACIÓN", "instituto");

        Alert.alert(
          "instituto modificado",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/institutos") }
          ]
        );
      }
    } else if (!nombre) {
      await insertLogAdmFail("MODIFICACIÓN", "instituto");
      Alert.alert("Error al modificar instituto","Se debe ingresar un nombre para el instituto");
    } else {
      Alert.alert("Error al modificar instituto","Se debe seleccionar al menos un lugar para el instituto");
    }
  };

  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBackReg title="Edición de Instituto" route="institutos" />

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
            <Text style={{ color: "white", fontSize: 15 }}>Instituto: </Text>
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
            {lugares.map((lugar) => (
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
    marginLeft: '1%'
  },
  lugaresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginLeft: '10%'
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

export default EditarInstituto;
