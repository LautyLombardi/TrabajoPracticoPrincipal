import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../util/Colors';

const ListUser = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
       <LinearGradient 
        colors={[colors.black, 'transparent']}
        style={styles.background}
      />
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
})

export default ListUser;