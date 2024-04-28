import * as React from 'react';
import { NavigationContainer, StackRouter } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CamaraScreen from './src/views/CamaraScreen';
import MenuScreen from './src/views/MenuScreen';
import * as NavigationBar from 'expo-navigation-bar';
import ListUser from './src/views/Dashboard/ListUsers';
import { colors } from './src/util/Colors';

import CamaraNueva from './src/views/CamaraNueva/CamaraNueva';

const Stack = createNativeStackNavigator();

function App() { 
  NavigationBar.setVisibilityAsync("hidden");

  const styleOptionsHeader = {headerShown: true, headerStyle: {backgroundColor: '#f1f1f1'},headerTintColor: {...colors.background}}

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home' screenOptions={ {headerShown: false}}
        >
          <Stack.Screen name="Home" component={CamaraNueva} />
          <Stack.Screen name="Menu" component={MenuScreen} options={styleOptionsHeader}/>
          <Stack.Screen name="Dashboard" component={ListUser} options={styleOptionsHeader}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;