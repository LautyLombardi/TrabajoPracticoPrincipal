import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export const Reportes = () => {

  return (
    <SafeAreaView style={styles.container}>
      {/** Menu */}
      <View style={styles.listBtns}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/reportes/visitantesPorDia")}>
              <Text style={styles.textBtnMenu}>Visitantes Por Dia</Text>
            </Pressable>
          </View>
          <View style={styles.col}>
            <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/reportes/visitantesPorUsuario")}>
              <Text style={styles.textBtnMenu}>Visitantes Por Usuario</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/reportes/visitanteshistorico")}>
              <Text style={styles.textBtnMenu}>visitantes historico</Text>
            </Pressable>
          </View>
          <View style={styles.col}>
            <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/reportes/visitanteshistorico rrhh")}>
              <Text style={styles.textBtnMenu}>visitantes historicos RRHH</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/reportes/erroresPorHora")}>
              <Text style={styles.textBtnMenu}>erroresPorHora</Text>
            </Pressable>
          </View>
          <View style={styles.col}>
            <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/image/visitor")}>
              <Text style={styles.textBtnMenu}>Registrar Imagen de Visitante</Text>
            </Pressable>
          </View>          
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
  header: {
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
  },
  // Menu de Botones
  listBtns: {
    flexDirection: 'column',
    width: 350,
    marginTop: 40,
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  buttonMenu: {
    height: 80,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBtnMenu: {
    color: '#000',
    textAlign: 'center',
  },
  buttonMenuDisabled: {
    backgroundColor: '#a3a3a3',
  },
});

export default Reportes;



