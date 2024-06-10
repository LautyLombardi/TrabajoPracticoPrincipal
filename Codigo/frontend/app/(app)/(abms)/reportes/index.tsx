import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';

export const Reportes = () => {

  return (
    <SafeAreaView style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='Reportes' route='menu' />

      {/** Menu */}
      <View style={styles.mainMenu}>
        <View style={styles.mainMenuItem}>
          <Pressable
            style={styles.buttonMenu} onPress={() => router.navigate("/reportes/visitantesPorDia")}>
            <Text style={styles.textBtnMenu}>Reportes Operativos: Visitantes que autorizó el usuario logueado</Text>
          </Pressable>
        </View>
        <View style={[styles.mainMenuItem, { marginTop: 3 }]}>
          <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/reportes/visitantesPorUsuario")}>
              <Text style={styles.textBtnMenu}>Reportes Gestion: Visitantes autenticados por cada usuario</Text>
          </Pressable>
        </View>
        <View style={[styles.mainMenuItem, { marginTop: 3 }]}>
          <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/reportes/visitanteshistorico")}>
              <Text style={styles.textBtnMenu}>Visitantes historico</Text>
          </Pressable>
        </View>
        <View style={[styles.mainMenuItem, { marginTop: 3 }]}>
          <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/reportes/visitanteshistorico rrhh")}>
              <Text style={styles.textBtnMenu}>Visitantes historicos por usuario seleccionado</Text>
          </Pressable>
        </View>        
      </View>
      <StatusBar style='light' />
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
  mainMenu: {
    marginTop:'5%',
    flexDirection: 'column',
    width: '70%',
    height: '20%',
    alignSelf: "center",
  },
  mainMenuItem: {
    flexDirection: 'row',
    borderRadius: 5,
    padding: 0,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  buttonMenu: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingLeft: '3%'
  },
  textBtnMenu: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
  },
});

export default Reportes;



