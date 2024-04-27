import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Button, View, Text, TextInput, StyleSheet, StatusBar } from 'react-native';
import ButtonNormal from '../components/ButtonNormal';
import { colors } from '../utils/Colors';

const RegistrarScreen = () => {
  const navigation = useNavigation();
  const [nombre, setNombre] = React.useState('');
  const [cargo, setCargo] = React.useState('');

  const handleSubmit = () => {
    // Aquí puedes hacer algo con los datos del formulario, como enviarlos a un servidor
    console.log('Nombre:', nombre);
    console.log('Cargo:', cargo);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nombre del Empleado:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ingrese el nombre del empleado"
      />
      <Text style={styles.text}>Cargo:</Text>
      <TextInput
        style={styles.input}
        value={cargo}
        onChangeText={setCargo}
        placeholder="Ingrese el cargo del empleado"
      />
      <Button title="Registrar" onPress={handleSubmit} color={colors.primary}/>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secundary
  },
  text: {
    color: colors.primary,
    marginBottom: 5,
    textAlign: 'left',
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: colors.secundary,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.primary
  },
});

export default RegistrarScreen;
