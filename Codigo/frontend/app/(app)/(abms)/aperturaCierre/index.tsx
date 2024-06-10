import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { router } from 'expo-router';
import HandleGoBackReg from '@/components/handleGoBack/HandleGoBackReg';

const ConfigurarHorarios = () => {
  const [openingTime, setOpeningTime] = useState<string>("");
  const [closingTime, setClosingTime] = useState<string>("");
  const [isOpeningTimePickerVisible, setIsOpeningTimePickerVisible] = useState<boolean>(false);
  const [isClosingTimePickerVisible, setIsClosingTimePickerVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleConfirmOpeningTime = (date: any) => {
    setOpeningTime(date.toTimeString().slice(0, 5));
    setIsOpeningTimePickerVisible(false);
  };

  const handleConfirmClosingTime = (date: any) => {
    setClosingTime(date.toTimeString().slice(0, 5));
    setIsClosingTimePickerVisible(false);
  };

  const handleTerminar = async () => {
    if (!isValidTime(openingTime) || !isValidTime(closingTime)) {
      Alert.alert("Formato de hora no válido", "El formato debe ser hh:mm");
      return;
    }

    // Show the spinner
    setLoading(true);

    // SLEEP for 2 seconds
    await new Promise<void>(resolve => setTimeout(resolve, 1000));

    // Hide the spinner
    setLoading(false);

    Alert.alert(
      "Horarios guardados",
      "",
      [
        { text: "OK", onPress: () => router.navigate("/menu") }
      ]
    );
  };

  const isValidTime = (time: any) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  };

  return (
    <View style={styles.container}>
      <HandleGoBackReg title='Configurar Horarios' route='dashboard' />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Hora de Apertura:</Text>
          <Pressable onPress={() => setIsOpeningTimePickerVisible(true)} style={styles.input}>
            <Text style={{ color: 'black' }}>{openingTime || '08:00'}</Text>
          </Pressable>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Hora de Cierre:</Text>
          <Pressable onPress={() => setIsClosingTimePickerVisible(true)} style={styles.input}>
            <Text style={{ color: 'black' }}>{closingTime || '18:00'}</Text>
          </Pressable>
        </View>
      </View>

      <Pressable onPress={handleTerminar} style={styles.button}>
        <Text style={styles.buttonText}>Guardar Horarios</Text>
      </Pressable>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      <DateTimePickerModal
        isVisible={isOpeningTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmOpeningTime}
        onCancel={() => setIsOpeningTimePickerVisible(false)}
        is24Hour={true}
      />

      <DateTimePickerModal
        isVisible={isClosingTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmClosingTime}
        onCancel={() => setIsClosingTimePickerVisible(false)}
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ConfigurarHorarios;