import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const ButtonNormal = ({ text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f1f1f1', 
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#02046f', 
    fontWeight: 'bold',
  },
});

export default ButtonNormal;
