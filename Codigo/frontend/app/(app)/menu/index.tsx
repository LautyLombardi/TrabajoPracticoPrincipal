import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { statusDay } from '@/api/services/openCloseDay';
import { useFocusEffect } from '@react-navigation/native';

export const Menu = () => {
  const [status, setStatusDay] = useState<boolean>(true);

  const handlerDay = async () => {
    try {
      const response = await statusDay();
      if (response === 403) {
        setStatusDay(false);
      } else {
        setStatusDay(true);
      }
    } catch (error) {
      console.error('Error al obtener el estado del día: ', error);
      setStatusDay(false); // Asumimos que el día está cerrado en caso de error
    }
  };

  // Utilizar useFocusEffect para ejecutar handlerDay cuando la pantalla del menú se enfoca
  useFocusEffect(
    useCallback(() => {
      handlerDay();
    }, [])
  );

  useEffect(() => {
    handlerDay();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/** Menu */}
      <View style={styles.listBtns}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/faceRecognition/user")}>
              <Text style={styles.textBtnMenu}>Autorizar Usuario</Text>
            </Pressable>
          </View>
          <View style={styles.col}>
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/faceRecognition/visitor")}>
              <Text style={styles.textBtnMenu}>Autorizar Visitante</Text>
            </Pressable>
          </View>
        </View>  
        <View style={styles.row}>
          <View style={styles.col}>
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/image/user")}>
              <Text style={styles.textBtnMenu}>Registrar Imagen de Usuario</Text>
            </Pressable>
          </View>
          <View style={styles.col}>
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/image/visitor")}>
              <Text style={styles.textBtnMenu}>Registrar Imagen de Visitante</Text>
            </Pressable>
          </View>          
        </View>          
        <View style={styles.row}> 
          <View style={styles.col}>
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/visitantes")}>
              <Text style={styles.textBtnMenu}>Administración de Visitantes</Text>
            </Pressable>
          </View>       
          <View style={styles.col}>
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/institutos")}>
              <Text style={styles.textBtnMenu}>Administración de Instituciones</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/roles")}>
              <Text style={styles.textBtnMenu}>Administración de Roles</Text>
            </Pressable>
          </View>
          <View style={styles.col}>
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/categorias")}>
              <Text style={styles.textBtnMenu}>Administración de Categorias</Text>
            </Pressable>
          </View>                  
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/empresas")}>
              <Text style={styles.textBtnMenu}>Administracion de Empresas</Text>
            </Pressable>
          </View>  
          <View style={styles.col}>
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/lugares")}>
              <Text style={styles.textBtnMenu}>Administracion de Lugares</Text>
            </Pressable>
          </View>  
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/Reportes")}>
              <Text style={styles.textBtnMenu}>Reportes</Text>
            </Pressable>
          </View>  
          <View style={styles.col}>
            <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/lugares")}>
              <Text style={styles.textBtnMenu}>Administracion de Lugares2</Text>
            </Pressable>
          </View>  
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/excepciones")}>
              <Text style={styles.textBtnMenu}>Cargar Excepción</Text>
            </Pressable>
          </View>  
          <View style={styles.col}>
          </View>  
        </View>
      </View>

      <View style={styles.dayButton}>
        <Link href={"/openCloseDay"} asChild>
          <Pressable style={styles.button}>
            <Text style={styles.text}>Apertura y Cierre del dia</Text>
          </Pressable>
        </Link>
      </View>
      <StatusBar style='light' />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000051',
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
  dayButton: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderColor: "#000",
  },
  buttonMenuDisabled: {
    backgroundColor: '#a3a3a3',
  },
  button: {
    backgroundColor: "#f1f1f1",
    width: "110%",
    padding: 20,
    borderRadius: 12,
  },
  text: {
    color: "#000",
    textAlign: "center",
    fontSize: 25,
  },
});

export default Menu;
