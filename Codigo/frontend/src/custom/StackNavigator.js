import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

class StackNavigation extends Stack.Navigator {
    render() {
        return (
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            {/* Agrega más pantallas aquí según sea necesario */}
          </Stack.Navigator>
        );
      }
}