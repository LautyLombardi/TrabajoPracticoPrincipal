import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { Rol } from '@/api/model/interfaces';
import useGetRolByDni from '@/hooks/roles/useGetRolByDni';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Reportes = () => {
  const [permition, setPermition] = useState<Rol>();
  const {role} = useGetRolByDni();

  const fetchRol = useCallback(async () => {
    if (role) {
      setPermition(role);
      await AsyncStorage.setItem('rol_data', JSON.stringify(role));
    }
  }, [role]);

  useEffect(() => {
    fetchRol();
  }, [fetchRol]);

  return (
    <SafeAreaView style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='Reportes' route='menu' />

      {/** Menu */}
      <View style={styles.mainMenu}>
        <View style={styles.mainMenuItem}>
          <Pressable
            disabled={permition ? permition?.systemReports === 0 : true}
            style={[styles.buttonMenu, (permition ? permition.systemReports === 0 : true) && styles.buttonMenuDisabled]}
            onPress={() => router.navigate("/reportes/visitantesPorDia")}>
            <Text style={styles.textBtnMenu}>Visitantes Por Dia</Text>
          </Pressable>
        </View>
        <View style={[styles.mainMenuItem, { marginTop: 3 }]}>
          <Pressable 
            disabled={permition ? permition?.systemReports === 0 : true} 
            style={[styles.buttonMenu, (permition ? permition.systemReports === 0 : true) && styles.buttonMenuDisabled]}
            onPress={() => router.navigate("/reportes/visitantesPorUsuario")}>
              <Text style={styles.textBtnMenu}>Visitantes Por Usuario</Text>
          </Pressable>
        </View>
        <View style={[styles.mainMenuItem, { marginTop: 3 }]}>
          <Pressable 
            disabled={permition ? permition?.name !== "RRHH" : true} 
            style={[styles.buttonMenu, (permition ? permition?.name !== "RRHH" : true) && styles.buttonMenuDisabled]}
            onPress={() => router.navigate("/reportes/visitanteshistorico")}>
              <Text style={styles.textBtnMenu}>Visitantes Historico</Text>
          </Pressable>
        </View>
        <View style={[styles.mainMenuItem, { marginTop: 3 }]}>
          <Pressable 
            disabled={permition ? permition?.name !== "RRHH" : true} 
            style={[styles.buttonMenu, (permition ? permition?.name !== "RRHH" : true) && styles.buttonMenuDisabled]}
            onPress={() => router.navigate("/reportes/visitanteshistorico rrhh")}>
              <Text style={styles.textBtnMenu}>Visitantes historicos Por Usuario</Text>
          </Pressable>
        </View>
        <View style={[styles.mainMenuItem, { marginTop: 3 }]}>
          <Pressable 
            disabled={permition ? permition?.name !== "Personal jerarquico" : true} 
            style={[styles.buttonMenu, (permition ? permition?.name !== "Personal jerarquico" : true) && styles.buttonMenuDisabled]}
            onPress={() => router.navigate("/reportes/duplicacion")}>
              <Text style={styles.textBtnMenu}>Duplicacíon de Visitantes y Usuarios</Text>
          </Pressable>
        </View>
        <View style={[styles.mainMenuItem, { marginTop: 3 }]}>
          <Pressable 
            disabled={permition ? permition?.name !== "Personal jerarquico" : true} 
            style={[styles.buttonMenu, (permition ? permition?.name !== "Personal jerarquico" : true) && styles.buttonMenuDisabled]}
            onPress={() => router.navigate("/reportes/syncError")}>
              <Text style={styles.textBtnMenu}>Detalles de Errores de Sincronización</Text>
          </Pressable>
        </View>      
        <View style={[styles.mainMenuItem, { marginTop: 3 }]}>
          <Pressable 
            disabled={permition ? permition?.name !== "Personal jerarquico" : true} 
            style={[styles.buttonMenu, (permition ? permition?.name !== "Personal jerarquico" : true) && styles.buttonMenuDisabled]}
            onPress={() => router.navigate("/reportes/erroresPorHora")}>
              <Text style={styles.textBtnMenu}>Errores de Sincronización por Hora</Text>
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
  buttonMenuDisabled: {
    backgroundColor: '#a3a3a3',
  },
});

export default Reportes;


