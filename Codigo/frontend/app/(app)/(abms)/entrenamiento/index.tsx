import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Modal, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { router } from 'expo-router';
import HandleGoBackReg from '@/components/handleGoBack/HandleGoBackReg';
import useInsertLogAdm from "@/hooks/logs/userInsertLogAdm";
import useInsertLogAdmFail from "@/hooks/logs/userInsertLogAdmFail";

const ConfigurarHorarioEntrenamiento = () => {
  const [trainingDay, setTrainingDay] = useState<string>("Lunes");
  const [trainingTime, setTrainingTime] = useState<string>("");
  const [isTrainingTimePickerVisible, setIsTrainingTimePickerVisible] = useState<boolean>(false);
  const [isDayPickerVisible, setIsDayPickerVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const insertLogAdm = useInsertLogAdm();
  const insertLogAdmFail = useInsertLogAdmFail();

  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const handleConfirmTrainingTime = (date: any) => {
    setTrainingTime(date.toTimeString().slice(0, 5));
    setIsTrainingTimePickerVisible(false);
  };

  const handleTerminar = async () => {
    if (!isValidTime(trainingTime)) {
      await insertLogAdmFail("CONFIGURACION", "Entrenamiento de Ia")      
      Alert.alert("Formato de hora no válido", "El formato debe ser hh:mm");
      return;
    }

    // Show the spinner
    setLoading(true);

    // SLEEP for 1 seconds
    await new Promise<void>(resolve => setTimeout(resolve, 1000));

    // Hide the spinner
    setLoading(false);
    await insertLogAdm("CONFIGURACION", "Entrenamiento de Ia")
    Alert.alert(
      "Horario de entrenamiento guardado",
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

  const renderDayItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => { setTrainingDay(item); setIsDayPickerVisible(false); }} style={styles.dayItem}>
      <Text style={styles.dayItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HandleGoBackReg title='Configurar Horario de Entrenamiento' route='dashboard' />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Día del Entrenamiento:</Text>
          <Pressable onPress={() => setIsDayPickerVisible(true)} style={styles.input}>
            <Text style={{ color: 'black' }}>{trainingDay}</Text>
          </Pressable>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Hora del Entrenamiento:</Text>
          <Pressable onPress={() => setIsTrainingTimePickerVisible(true)} style={styles.input}>
            <Text style={{ color: 'black' }}>{trainingTime || '08:00'}</Text>
          </Pressable>
        </View>
      </View>

      <Pressable onPress={handleTerminar} style={styles.button}>
        <Text style={styles.buttonText}>Guardar Horario</Text>
      </Pressable>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      <DateTimePickerModal
        isVisible={isTrainingTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTrainingTime}
        onCancel={() => setIsTrainingTimePickerVisible(false)}
        is24Hour={true}
      />

      <Modal
        visible={isDayPickerVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={daysOfWeek}
              renderItem={renderDayItem}
              keyExtractor={(item) => item}
            />
            <Pressable onPress={() => setIsDayPickerVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  dayItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dayItemText: {
    fontSize: 18,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#00759c',
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: 'white',
    textAlign: 'center',
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

export default ConfigurarHorarioEntrenamiento;