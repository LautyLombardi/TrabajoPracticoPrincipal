import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Link, router, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export const Menu = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/** Menu */}
      <View style={styles.listBtns}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/image/user")}>
              <Text style={styles.textBtnMenu}>Registrar Imagen de Usuario</Text>
            </Pressable>
          </View>
          <View style={styles.col}>
            <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/image/visitor")}>
              <Text style={styles.textBtnMenu}>Registrar Imagen de Visitante</Text>
            </Pressable>
          </View>          
        </View>          
        <View style={styles.row}> 
          <View style={styles.col}>
            <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/visitantes")}>
              <Text style={styles.textBtnMenu}>Administración de Visitantes</Text>
            </Pressable>
          </View>       
          <View style={styles.col}>
            <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/institutos")}>
              <Text style={styles.textBtnMenu}>Administración de Instituciones</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/roles")}>
              <Text style={styles.textBtnMenu}>Administración de Roles</Text>
            </Pressable>
          </View>
          <View style={styles.col}>
            <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/categorias")}>
              <Text style={styles.textBtnMenu}>Administración de Categorias</Text>
            </Pressable>
          </View>                  
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/empresas")}>
              <Text style={styles.textBtnMenu}>Administracion de Empresas</Text>
            </Pressable>
          </View>  
          <View style={styles.col}></View>
        </View>
      </View>

      {/** Boton de autenticar */}
      <View style={styles.bottomButton}>
        <Link href={"/autenticar"} asChild>
          <Pressable style={styles.button}>
            <Text style={styles.text}>Autenticar</Text>
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
  },
  textBtnMenu: {
    color: '#000',
    textAlign: 'center',
  },
  // Botom de Autenticar
  bottomButton: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderColor: "#000",
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
