import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OpenCloseDay = () => { 

  const handleOpenDay = async () => {
    try {
      const dayStatus = await AsyncStorage.getItem('dayStatus');
      const isDayOpen = dayStatus ? JSON.parse(dayStatus) : false;

      if(!isDayOpen){
        await AsyncStorage.setItem('dayStatus', JSON.stringify(true));
        console.log('status del dia seteado en open day', await AsyncStorage.getItem('dayStatus'));
        // TODO: logica de disparar LOG
        Alert.alert(
          "Día Abierto",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/menu") }
          ]
        );
      } else {
        Alert.alert(
          "El día ya se encuentra abierto",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/menu") }
          ]
        );
      }
    } catch (error) {
      console.error('Error al abrir el día:', error);
    }
  };

  const handleCloseDay = async () => {
    try {
      const dayStatus = await AsyncStorage.getItem('dayStatus');
      const isDayOpen = dayStatus ? JSON.parse(dayStatus) : false;

      if(isDayOpen){
        await AsyncStorage.setItem('dayStatus', JSON.stringify(false));
        console.log('status del dia seteado en close day', await AsyncStorage.getItem('dayStatus'));
        // TODO: logica de disparar LOG
        Alert.alert(
          "Día Cerrado",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/menu") }
          ]
        );
      } else {
        Alert.alert(
          "El día ya se encuentra cerrado",
          "",
          [
            { text: "OK", onPress: () => router.navigate("/menu") }
          ]
        );
      }
    } catch (error) {
      console.error('Error al cerrar el día:', error);
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
