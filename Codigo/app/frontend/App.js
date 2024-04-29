import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Views 
import MenuScreen from './src/views/MenuScreen';
import HomeScreen from './src/views/HomeScreen';

// Others
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from './src/util/Colors';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function App() {

  const styleOptionsHeader = {headerShown: true, headerStyle: {backgroundColor: '#f1f1f1'},headerTintColor: {...colors.background}}

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={ {headerShown: false}}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} options={styleOptionsHeader}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
