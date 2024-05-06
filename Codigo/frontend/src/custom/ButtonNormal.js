import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../util/Colors';

const ButtonNormal = ({onPress, title}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#222fff',
        padding: 12,
        borderWidth: 2,
        borderColor: '#f1f1f1',
        borderRadius: 5,
    },
    text: {
        color: colors.text,
        textAlign: 'center'
    }
})

export default ButtonNormal;