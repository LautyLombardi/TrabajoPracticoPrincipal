import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Pressable, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';
// Icons
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import { AntDesign, Ionicons, MaterialIcons, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAdmDni } from '@/api/services/storage';
import { Rol } from '@/api/model/interfaces';
import useGetRolByDni from '@/hooks/roles/useGetRolByDni';
import useSync from  '@/hooks/useSync';

const Menu = () => {
  const [netConection, setNetConection] = useState<boolean>(true);
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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if(state.isConnected){
        setNetConection(state.isConnected);
      }else {
        setNetConection(false);
      }
    });

    // Check the connection status initially
    NetInfo.fetch().then(state => {
      if(state.isConnected){
        setNetConection(state.isConnected);
      }else {
        setNetConection(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handlerLogout = async () => {
    try {
      const data = await getAdmDni();
      await AsyncStorage.removeItem('adm_data');
      Alert.alert(
        "Usuario deslogueado",
        `Usuario con DNI: ${data} deslogueado`,
        [
          { text: "OK", onPress: () => router.navigate("/(app)") }
        ]
      );
    } catch (error) {
      console.error('Error al desloguear usuario: ', error);
      Alert.alert("Error al desloguear usuario");
    }
  };

  const toggleMenu = (menu: string) => {
    setIsMenuOpen(menu === 'main' ? !isMenuOpen : false);
    setAuthMenuOpen(menu === 'auth' ? !isAuthMenuOpen : false);
    setLoginMenuOpen(menu === 'login' ? !isLoginMenuOpen : false);
    setImageMenuOpen(menu === 'image' ? !isImageMenuOpen : false);
    setEntitiesMenuOpen(menu === 'entities' ? !isEntitiesMenuOpen : false);
  };

  const [status, setStatusDay] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAuthMenuOpen, setAuthMenuOpen] = useState<boolean>(false);
  const [isLoginMenuOpen, setLoginMenuOpen] = useState<boolean>(false);
  const [isImageMenuOpen, setImageMenuOpen] = useState<boolean>(false);
  const [isEntitiesMenuOpen, setEntitiesMenuOpen] = useState<boolean>(false);

  const handlerDay = useCallback(async () => {
    try {
      const dayStatus = await AsyncStorage.getItem('dayStatus');
      const isDayOpen = dayStatus ? JSON.parse(dayStatus) : false;
      setStatusDay(isDayOpen);
    } catch (error) {
      console.error('Error al obtener el estado del día:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      handlerDay();
    }, [handlerDay])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Config button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.gearButton} onPress={() => toggleMenu('main')}>
          <FontAwesome6 name="gear" size={24} color="black" />
        </TouchableOpacity>
        {isMenuOpen && (
          <View style={styles.menu}>
            <TouchableOpacity
              disabled={permition ? permition?.routingConnection === 0 : true}
              style={[styles.menuItem, (permition ? permition.routingConnection === 0 : true) && styles.buttonMenuDisabled]}
              onPress={() => router.navigate("/ruteo")}>
              <MaterialIcons name="router" size={24} color="black" />
              <Text style={styles.menuText}>Ruteo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={permition ? permition?.routingConnection === 0 : true}
              style={[styles.menuItem, (permition ? permition.routingConnection === 0 : true) && styles.buttonMenuDisabled]}
              onPress={() => router.navigate("/mail")}>
              <Foundation name="mail" size={24} color="black" />
              <Text style={styles.menuText}>Cambio de Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={permition ? permition?.routingConnection === 0 : true}
              style={[styles.menuItem, (permition ? permition.routingConnection === 0 : true) && styles.buttonMenuDisabled]}
              onPress={() => router.navigate("/entrenamiento")}>
              <MaterialCommunityIcons name="clock" size={24} color="black" />
              <Text style={styles.menuText}>Horario de Entrenamiento de la IA</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={permition ? permition?.routingConnection === 0 : true}
              style={[styles.menuItem, (permition ? permition.routingConnection === 0 : true) && styles.buttonMenuDisabled]}
              onPress={() => router.navigate("/institutionalImage")}>
              <Entypo name="images" size={24} color="black" />
              <Text style={styles.menuText}>Cambio de Imagen Institucional</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={permition ? permition?.routingConnection === 0 : true}
              style={[styles.menuItem, (permition ? permition.routingConnection === 0 : true) && styles.buttonMenuDisabled]}
              onPress={() => router.navigate("/aperturaCierre")}>
              <MaterialCommunityIcons name="city-variant" size={24} color="black" />
              <Text style={styles.menuText}>Horario de Cierre Automático</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={permition ? permition?.systemLog === 0 : true}
              style={[styles.menuItem, (permition ? permition.systemLog === 0 : true) && styles.buttonMenuDisabled]}
              onPress={() => router.navigate("/logs")}>
              <Entypo name="code" size={24} color="black" />
              <Text style={styles.menuText}>Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handlerLogout()}>
              <MaterialCommunityIcons name="logout" size={24} color="black" />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Main Menu */}
      <View style={styles.mainMenu}>
        <View style={styles.mainMenuItem}>
          <Pressable
            disabled={!status || (permition ? permition?.onlineLogin === 0 : true) || !netConection}
            style={[styles.buttonMenu, (!status || (permition ? permition.onlineLogin === 0 : true) || !netConection) && styles.buttonMenuDisabled]}
            onPress={() => toggleMenu('auth')}>
            <MaterialCommunityIcons name="face-recognition" size={24} color="black" />
            <Text style={styles.textBtnMenu}>Autorizar</Text>
          </Pressable>
        </View>
        {isAuthMenuOpen && (
          <>
            <View style={[styles.mainMenuItem, { marginLeft: 5 }]}>
              <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/faceRecognition/user")}>
                <AntDesign name="right" size={24} color="black" />
                <Text style={styles.textBtnMenu}>Autorizar Usuario</Text>
              </Pressable>
            </View>
            <View style={[styles.mainMenuItem, { marginLeft: 5 }]}>
              <Pressable
                disabled={!status || (permition ? permition?.visitorAuthentication === 0 : true)}
                style={[styles.buttonMenu, (!status || (permition ? permition.visitorAuthentication === 0 : true)) && styles.buttonMenuDisabled]}
                onPress={() => router.navigate("/faceRecognition/visitor")}>
                <AntDesign name="right" size={24} color="black" />
                <Text style={styles.textBtnMenu}>Autorizar Visitante</Text>
              </Pressable>
            </View>
          </>
        )}
        <View style={[styles.mainMenuItem, { marginTop: 3 }]}>
          <Pressable
            disabled={!status || (permition ? permition?.offlineLogin === 0 : true) || netConection}
            style={[styles.buttonMenu, (!status || (permition ? permition.offlineLogin === 0 : true) || netConection) && styles.buttonMenuDisabled]}
            onPress={() => toggleMenu('login')}>
            <MaterialCommunityIcons name="login" size={24} color="black" />
            <Text style={styles.textBtnMenu}>Autenticación Manual</Text>
          </Pressable>
        </View>
        {isLoginMenuOpen && (
          <>
            <View style={[styles.mainMenuItem, { marginLeft: 5 }]}>
              <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/login/user")}>
                <AntDesign name="right" size={24} color="black" />
                <Text style={styles.textBtnMenu}>Autenticación Manual de Usuario</Text>
              </Pressable>
            </View>
            <View style={[styles.mainMenuItem, { marginLeft: 5 }]}>
              <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/login/visitor")}>
                <AntDesign name="right" size={24} color="black" />
                <Text style={styles.textBtnMenu}>Autenticación Manual de Visitante</Text>
              </Pressable>
            </View>
          </>
        )}
        <View style={[styles.mainMenuItem, { marginTop: 3 }]}>
          <Pressable disabled={!status || !netConection} 
            style={[styles.buttonMenu, (!status || !netConection) && styles.buttonMenuDisabled]} onPress={() => toggleMenu('image')}>
            <Entypo name="camera" size={24} color="black" />
            <Text style={styles.textBtnMenu}>Registrar Imagen</Text>
          </Pressable>
        </View>
        {isImageMenuOpen && (
          <>
            <View style={[styles.mainMenuItem, { marginLeft: 5 }]}>
              <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/image/user")}>
                <AntDesign name="right" size={24} color="black" />
                <Text style={styles.textBtnMenu}>Registrar Imagen de Usuario</Text>
              </Pressable>
            </View>
            <View style={[styles.mainMenuItem, { marginLeft: 5 }]}>
              <Pressable disabled={!status} style={[styles.buttonMenu, !status && styles.buttonMenuDisabled]} onPress={() => router.navigate("/image/visitor")}>
                <AntDesign name="right" size={24} color="black" />
                <Text style={styles.textBtnMenu}>Registrar Imagen de Visitante</Text>
              </Pressable>
            </View>
          </>
        )}
        <View style={[styles.mainMenuItem, { marginTop: 3 }]}>
          <Pressable style={styles.buttonMenu} onPress={() => toggleMenu('entities')}>
            <Ionicons name="person-add-sharp" size={24} color="black" />
            <Text style={styles.textBtnMenu}>Administración de Entidades</Text>
          </Pressable>
        </View>
        {isEntitiesMenuOpen && (
          <>
            <View style={[styles.mainMenuItem, { marginLeft: 5 }]}>
              <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/usuarios")}>
                <Text style={styles.textBtnMenu}>Administración de Usuarios</Text>
              </Pressable>
            </View>
            <View style={[styles.mainMenuItem, { marginLeft: 5 }]}>
              <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/visitantes")}>
                <Text style={styles.textBtnMenu}>Administración de Visitantes</Text>
              </Pressable>
            </View>
            <View style={[styles.mainMenuItem, { marginLeft: 5 }]}>
              <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/roles")}>
                <Text style={styles.textBtnMenu}>Administración de Roles</Text>
              </Pressable>
            </View>
            <View style={[styles.mainMenuItem, { marginLeft: 5 }]}>
              <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/categorias")}>
                <Text style={styles.textBtnMenu}>Administración de Categorias</Text>
              </Pressable>
            </View>
            <View style={[styles.mainMenuItem, { marginLeft: 5 }]}>
              <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/empresas")}>
                <Text style={styles.textBtnMenu}>Administracion de Empresas</Text>
              </Pressable>
            </View>
            <View style={[styles.mainMenuItem, { marginLeft: 5 }]}>
              <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/lugares")}>
                <Text style={styles.textBtnMenu}>Administracion de Lugares</Text>
              </Pressable>
            </View>
            <View style={[styles.mainMenuItem, { marginLeft: 5 }]}>
              <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/institutos")}>
                <Text style={styles.textBtnMenu}>Administración de Instituciones</Text>
              </Pressable>
            </View>
            <View style={[styles.mainMenuItem, { marginLeft: 5 }]}>
              <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/excepciones")}>
                <Text style={styles.textBtnMenu}>Administracion de Excepciones</Text>
              </Pressable>
            </View>
          </>
        )}

        <View style={[styles.mainMenuItem, { marginTop: 3 }]}>
          <Pressable
            disabled={permition ? permition?.systemReports === 0 : true}
            style={[styles.buttonMenu, (permition ? permition.systemReports === 0 : true) && styles.buttonMenuDisabled]}
            onPress={() => router.navigate("/reportes")}>
            <Entypo name="bar-graph" size={24} color="black" />
            <Text style={styles.textBtnMenu}>Reportes</Text>
          </Pressable>
        </View>
      </View>

      {/* Open CLose Day */}
      <View style={styles.dayButton}>
        <Link href={"/openCloseDay"} asChild>
          <Pressable
            disabled={permition ? permition?.dayStartEnd === 0 : true}
            style={styles.button}
          >
            <Text style={styles.text}>Apertura y Cierre del dia</Text>
          </Pressable>
        </Link>
      </View>
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
    padding: 25,
    marginTop: '5%',
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
    marginTop: 8,
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
  // Main Menu
  mainMenu: {
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
  // Open Close Day
  dayButton: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: '#E8E8E8',
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
  buttonMenuDisabled: {
    backgroundColor: '#a3a3a3',
  },
});

export default Menu;