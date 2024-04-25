import * as React from 'react';
import { NavigationContainer, StackRouter } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CamaraScreen from './src/views/CamaraScreen';
import MenuScreen from './src/views/MenuScreen';
import * as NavigationBar from 'expo-navigation-bar';


const Stack = createNativeStackNavigator();

function App() {
 
  NavigationBar.setVisibilityAsync("hidden");


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={ {headerShown: false}}
      >
        <Stack.Screen name="Home" component={CamaraScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;