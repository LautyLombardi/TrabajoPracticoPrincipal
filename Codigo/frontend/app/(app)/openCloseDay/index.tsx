import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Alert } from 'react-native';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { closeDay, openDay } from '@/api/services/openCloseDay';
import { router } from 'expo-router'

const OpenCloseDay = () => {

  const handleOpenDay = async () => {
    try {
      console.log('open day');
      const response = await openDay();
      if(response === 200){
        Alert.alert(
          "Día Abierto",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/menu") }
          ]
        );
      } 
      if(response === 204){
        Alert.alert(
          "El día ya se encuentra abierto",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/menu") }
          ]
        );
      }
      
    } catch (error) {
      console.error('Error al abrir el dia: ', error);
    }
  };

  const handleCloseDay = async () => {
    try {
      console.log('close day');
      const response = await closeDay();
      if(response === 200){
        Alert.alert(
          "Día Cerrado",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/menu") }
          ]
        );
      } 
      if(response === 204){
        Alert.alert(
          "El día ya se encuentra cerrado",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/menu") }
          ]
        );
      }
    } catch (error) {
      console.error('Error al cerrar el dia: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='Apertura y Cierre del dia' route='menu' />

      <View style={styles.listBtns}>
        <View style={styles.row}>
          <Pressable style={styles.buttonMenu} onPress={handleOpenDay}>
            <Text style={styles.textBtnMenu}>Apertura del dia</Text>
          </Pressable>
          <Pressable style={styles.buttonMenu} onPress={handleCloseDay}>
            <Text style={styles.textBtnMenu}>Cierre del dia</Text>
          </Pressable>
        </View>          
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000051',
    alignItems: 'center',
  },
  // Menu de Botones
  listBtns: {
    width: 350,
    marginTop: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonMenu: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
    flex: 1,
    alignItems: 'center',
  },
  textBtnMenu: {
    color: '#000',
    textAlign: 'center',
  },
});

export default OpenCloseDay;
