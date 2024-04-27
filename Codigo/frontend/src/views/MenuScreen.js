import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Button, View, Text, StyleSheet, StatusBar } from 'react-native';
import ButtonNormal from '../components/ButtonNormal';
import { colors } from '../utils/Colors';

const MenuScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
    <ButtonNormal 
      text={"ir al inicio"} 
      onPress={() => navigation.navigate("Home", onBlank=true)}
    />
    
    <ButtonNormal 
      text={"Mostrar"} 
      onPress={() => navigation.navigate("Dashboard", onBlank=true)}
    />
    
    <ButtonNormal 
      text={"Registrar"} 
      onPress={() => navigation.navigate("Registrar", onBlank=true)}
    />

    <ButtonNormal 
      text={"Autenticar"}
      onPress={() => navigation.navigate("Autenticar", onBlank=true)}
    />
    
    <StatusBar backgroundColor="white" barStyle="dark-content" />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary
  },
  text: {
    color: colors.secundary
  }
})

export default MenuScreen;
