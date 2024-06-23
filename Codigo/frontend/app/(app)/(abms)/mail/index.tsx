import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Modal, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { router } from 'expo-router';
import HandleGoBackReg from '@/components/handleGoBack/HandleGoBackReg';
import sendEmail from '@/api/services/mailService';
import useInsertLogAdm from "@/hooks/logs/userInsertLogAdm";
import useInsertLogAdmFail from "@/hooks/logs/userInsertLogAdmFail";

const ConfigurarReporte = () => {
  const [email, setEmail] = useState<string>("");
  const [reportDay, setReportDay] = useState<string>("Lunes");
  const [reportTime, setReportTime] = useState<string>("");
  const [isReportTimePickerVisible, setIsReportTimePickerVisible] = useState<boolean>(false);
  const [isDayPickerVisible, setIsDayPickerVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const insertLogAdm = useInsertLogAdm();
  const insertLogAdmFail = useInsertLogAdmFail();

  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const handleConfirmReportTime = (date: any) => {
    setReportTime(date.toTimeString().slice(0, 5));
    setIsReportTimePickerVisible(false);
  };

  const handleTerminar = async () =>  {
    if (!isValidTime(reportTime)) {
      await insertLogAdmFail("CONFIGURACION", "mail")
      Alert.alert("Formato de hora no válido", "El formato debe ser hh:mm");
      return;
    }

    if (!isValidEmail(email)) {
      await insertLogAdmFail("CONFIGURACION", "mail")
      Alert.alert("Correo no válido", "Por favor ingresa un correo electrónico válido");
      return;
    }

    if (!reportDay) {
      Alert.alert("Día no seleccionado", "Por favor seleccione un día");
      return;
    }

    // Show the spinner
    setLoading(true);
    
    if(email && reportDay && reportTime){
      const response : number = await sendEmail(email, reportDay, reportTime);
      if(response === 200){    
        await insertLogAdm("CONFIGURACION", "mail")
        Alert.alert(
          "Configuración guardada",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/menu") }
          ]
        );
      } else {
        Alert.alert("Error al enviar correo");
      }
    }
    // SLEEP for 2 seconds
    await new Promise<void>(resolve => setTimeout(resolve, 1000));

    // Hide the spinner
    setLoading(false);
  };

  const isValidTime = (time: any) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  };

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const renderDayItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => { setReportDay(item); setIsDayPickerVisible(false); }} style={styles.dayItem}>
      <Text style={styles.dayItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HandleGoBackReg title='Configurar de mail' route='menu' />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Correo Electrónico:</Text>
          <TextInput
            placeholder='correo@ejemplo.com'
            placeholderTextColor={"gray"}
            onChangeText={setEmail}
            value={email}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Día del Reporte:</Text>
          <Pressable onPress={() => setIsDayPickerVisible(true)} style={styles.input}>
            <Text style={{ color: 'black' }}>{reportDay}</Text>
          </Pressable>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Hora del Reporte:</Text>
          <Pressable onPress={() => setIsReportTimePickerVisible(true)} style={styles.input}>
            <Text style={{ color: 'black' }}>{reportTime || '08:00'}</Text>
          </Pressable>
        </View>
      </View>

      <Pressable onPress={handleTerminar} style={styles.button}>
        <Text style={styles.buttonText}>Guardar Configuración</Text>
      </Pressable>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      <DateTimePickerModal
        isVisible={isReportTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmReportTime}
        onCancel={() => setIsReportTimePickerVisible(false)}
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

export default ConfigurarReporte;