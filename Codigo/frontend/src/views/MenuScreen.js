import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Button, View, Text } from 'react-native';

const MenuScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Ir al inicio"
        onPress={() => navigation.navigate("Home", onBlank=true)}
      />
    </View>
  );
}

export default MenuScreen;