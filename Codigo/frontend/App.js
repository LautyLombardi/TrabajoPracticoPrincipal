import * as React from 'react';
import { NavigationContainer, StackRouter } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CamaraScreen from './src/views/CamaraScreen';
import MenuScreen from './src/views/MenuScreen';
import * as NavigationBar from 'expo-navigation-bar';
import DashboardScreen from './src/views/DashboardScreen';
import { colors } from './src/utils/Colors';
import AutenticarScreen from './src/views/AutenticarScreen';
import RegistrarScreen from './src/views/RegistrarScreen';


const Stack = createNativeStackNavigator();

function App() {
 
  NavigationBar.setVisibilityAsync("hidden");


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={ {headerShown: false}}
      >
        <Stack.Screen name="Home" component={CamaraScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{headerShown: true, headerStyle: {backgroundColor: colors.primary}, headerTintColor: colors.secundary}}/>
        <Stack.Screen name="Autenticar" component={AutenticarScreen} />
        <Stack.Screen name="Registrar" component={RegistrarScreen} options={{headerShown: true, headerStyle: {backgroundColor: colors.primary}, headerTintColor: colors.secundary}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;