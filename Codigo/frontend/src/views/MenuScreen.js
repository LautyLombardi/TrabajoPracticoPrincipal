import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { colors } from '../util/Colors';
import DateComponent from '../custom/DateComponent';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonNormal from '../custom/ButtonNormal';

const MenuScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
       <LinearGradient 
        colors={[colors.black, 'transparent']}
        style={styles.background}
      />
      <DateComponent styleContainer={styles.containerDate} styleText={styles.textDate}/>
      <View style={styles.buttonList}>
        <ButtonNormal
          title="Ir al inicio"
          onPress={() => navigation.navigate("Home", onBlank=true)}
        />
              <ButtonNormal
          title="Lista de Usuarios"
          onPress={() => navigation.navigate("Dashboard", onBlank=true)
        }
        />
              <ButtonNormal
          title="Registrar"
          onPress={() => navigation.navigate("Home", onBlank=true)
        }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: colors.background
    },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: "100%",
    },
    buttonList: {
      gap: 10,
      flex: 2,
      justifyContent: 'center',
      alignContent: 'center',
      flexDirection: 'column'
    },

    // Estilos de las fechas
    containerDate: {
      flex: 0,
      width: '100%',
      padding: 30,
      justifyContent: 'flex-start'
    },
    textDate: {
      color: colors.text,
      textAlign: 'left'
    }

})

export default MenuScreen;