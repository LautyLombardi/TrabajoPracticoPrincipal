import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Pressable, SafeAreaView, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { statusDay } from '@/api/services/openCloseDay';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';

export const Menu = () => {
  const [status, setStatusDay] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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
      setStatusDay(false); 
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
      {/* Config button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.gearButton} onPress={toggleMenu}>
          <FontAwesome6 name="gear" size={24} color="black" />
        </TouchableOpacity>
        {isMenuOpen && (
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Ruteo')}>
              <MaterialIcons name="router" size={24} color="black" />
              <Text style={styles.menuText}>Ruteo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Cambio de mail')}>
              <Foundation name="mail" size={24} color="black" />
              <Text style={styles.menuText}>Cambio de mail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Horatio de entrenamiento de la IA')}>
              <MaterialCommunityIcons name="clock" size={24} color="black" />
              <Text style={styles.menuText}>Horatio de entrenamiento de la IA</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Cambio de imagen institucional')}>
              <MaterialCommunityIcons name="city-variant" size={24} color="black" />
              <Text style={styles.menuText}>Cambio de imagen institucional</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.navigate("/logs")}>
              <Entypo name="code" size={24} color="black" />
              <Text style={styles.menuText}>Logs</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Menu */}
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
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/login/user")}>
              <Text style={styles.textBtnMenu}>Login Manual de Usuario</Text>
            </Pressable>
          </View>
          <View style={styles.col}>
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/login/visitor")}>
              <Text style={styles.textBtnMenu}>Login Manual de Visitante</Text>
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
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/usuarios")}>
              <Text style={styles.textBtnMenu}>Administración de Usuarios</Text>
            </Pressable>
          </View>
          <View style={styles.col}>
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/visitantes")}>
              <Text style={styles.textBtnMenu}>Administración de Visitantes</Text>
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
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/excepciones")}>
              <Text style={styles.textBtnMenu}>Administracion de Excepciones</Text>
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
          </View>  
          <View style={styles.col}>
            <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/reportes")}>
              <Entypo name="bar-graph" size={24} color="black" />
              <Text style={styles.textBtnMenu}>Reportes</Text>
            </Pressable>
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
    backgroundColor: '#00759c',
  },
  header: {
    width: "100%",
    alignItems: "flex-end",
    padding: 20,
    zIndex: 3,
  },
  gearButton: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  menu: {
    position: 'absolute',
    marginTop:8,
    top: 60,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 0,
    paddingLeft: 15,
    width: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  menuItem: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
  },
  listBtns: {
    flexDirection: 'column',
    width: 350,
    marginTop: 40,
    alignSelf: "center",
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
