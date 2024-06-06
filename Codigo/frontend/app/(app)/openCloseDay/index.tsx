import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Alert } from 'react-native';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { closeDay, openDay } from '@/api/services/openCloseDay';
import { router } from 'expo-router';

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
        <Pressable style={styles.buttonMenu} onPress={handleOpenDay}>
          <Text style={styles.textBtnMenu}>Apertura del dia</Text>
        </Pressable>
        <Pressable style={styles.buttonMenu} onPress={handleCloseDay}>
          <Text style={styles.textBtnMenu}>Cierre del dia</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00759c',
    alignItems: 'center',
  },
  // Menu de Botones
  listBtns: {
    width: '80%',
    marginTop: '40%',
    alignItems: 'center',
  },
  buttonMenu: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 10,
    elevation: 5,
    width: '100%',
    alignItems: 'center',
  },
  textBtnMenu: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
  },
});

export default OpenCloseDay;
