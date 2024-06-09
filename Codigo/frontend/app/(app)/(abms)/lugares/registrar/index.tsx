import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import HandleGoBackReg from '@/components/handleGoBack/HandleGoBackReg';
import useInsertPlace from '@/hooks/place/useInsertPlace';
import useInsertLogAdm from '@/hooks/logs/userInsertLogAdm';
import useInsertLogAdmFail from '@/hooks/logs/userInsertLogAdmFail';

const RegistrarLugar = () => {
  const insertPlace = useInsertPlace()
  const insertLogAdm= useInsertLogAdm()
  const insertLogAdmFail= useInsertLogAdmFail()

  const [nombre, setNombre] = useState<string>("");
  const [abbreviation, setAbbreviation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [openTime, setOpenTime] = useState<string>("");
  const [closeTime, setCloseTime] = useState<string>("");
  const [isOpenPickerVisible, setIsOpenPickerVisible] = useState<boolean>(false);
  const [isClosePickerVisible, setIsClosePickerVisible] = useState<boolean>(false);

  const handleConfirmOpenTime = (date: any) => {
    setOpenTime(date.toTimeString().slice(0, 5));
    setIsOpenPickerVisible(false);
  };

  const handleConfirmCloseTime = (date: any) => {
    setCloseTime(date.toTimeString().slice(0, 5));
    setIsClosePickerVisible(false);
  };

  const handleTerminar = async () => {
    if (!isValidTime(openTime) || !isValidTime(closeTime)) {
      Alert.alert("Formato de hora no válido", "El formato debe ser hh:mm");
      return;
    }

    const insert = await insertPlace(nombre, abbreviation, description, openTime, closeTime);
    if (insert === 0) {
      Alert.alert("Error al guardar lugar");
      const log= await insertLogAdmFail("ALTA","lugar")
      if(log ===0){
        Alert.alert("Error al crear el log")
      }
  
    }else {
      const log= await insertLogAdm("ALTA","lugar")

      if(log ===0){
        Alert.alert("Error al crear el log")
      }

      Alert.alert(
        "Lugar guardado",
        "",
        [
          { text: "OK", onPress: () => router.navigate("/lugares") }
        ]
      );
      
    }
  };

  const isValidTime = (time: any) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  };

  return (
    <View style={styles.container}>
      <HandleGoBackReg title='Registro Lugar' route='lugares' />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Nombre:</Text>
          <TextInput
            placeholder='Modulo 7'
            placeholderTextColor={"gray"}
            onChangeText={setNombre}
            value={nombre}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Abreviación:</Text>
          <TextInput
            placeholder='mod 7'
            placeholderTextColor={"gray"}
            onChangeText={setAbbreviation}
            value={abbreviation}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Descripción:</Text>
          <TextInput
            placeholder='Modulo para cursar materias'
            placeholderTextColor={"gray"}
            onChangeText={setDescription}
            value={description}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Hora de Apertura:</Text>
          <Pressable onPress={() => setIsOpenPickerVisible(true)} style={styles.input}>
            <Text style={{ color: 'black' }}>{openTime || '08:00'}</Text>
          </Pressable>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Hora de Cierre:</Text>
          <Pressable onPress={() => setIsClosePickerVisible(true)} style={styles.input}>
            <Text style={{ color: 'black' }}>{closeTime || '18:00'}</Text>
          </Pressable>
        </View>
      </View>

      <Pressable onPress={handleTerminar} style={styles.button}>
        <Text style={styles.buttonText}>Registrar</Text>
      </Pressable>

      <DateTimePickerModal
        isVisible={isOpenPickerVisible}
        mode="time"
        onConfirm={handleConfirmOpenTime}
        onCancel={() => setIsOpenPickerVisible(false)}
        is24Hour={true}
      />

      <DateTimePickerModal
        isVisible={isClosePickerVisible}
        mode="time"
        onConfirm={handleConfirmCloseTime}
        onCancel={() => setIsClosePickerVisible(false)}
        is24Hour={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00759c',
    flex: 1,
    paddingVertical: 30,
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    marginTop: 20,
    width: '90%',
  },
  inputContainer: {
    height: 70,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  labelText: {
    color: "white",
    fontSize: 15,
    textAlign: "left",
    width: "30%",
    marginRight: 20, 
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    flex: 1,
    borderRadius: 5,
    color: 'black',
    justifyContent: 'center',
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

export default RegistrarLugar;