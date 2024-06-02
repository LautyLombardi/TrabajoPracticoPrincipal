import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type PropsGoBack = {
  title: string,
  route: string,
};

const HandleGoBackReg: React.FC<PropsGoBack> = ({ title = "Volver", route = "menu" }) => {

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior='height'
    >
      <Ionicons name='arrow-back-outline' size={25} onPress={()=> router.navigate(`/${route}`)} />
      <Text style={styles.title}>{title}</Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: '3%',
    paddingVertical:'3%',
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: '3%',
  },
});

export default HandleGoBackReg;