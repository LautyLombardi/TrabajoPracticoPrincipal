import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type PropsGoBack = {
  title: string,
  route: string,
};

const HandleGoBackReg: React.FC<PropsGoBack> = ({ title = "Volver", route = "menu" }) => {
  const goBack = () => {
    const canGoBack = router.canGoBack();
    if (canGoBack) {
      router.back();
    } else {
      router.navigate(`/${route}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior='height'
    >
      <Ionicons name='arrow-back-outline' size={25} onPress={goBack} />
      <Text style={styles.title}>{title}</Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: '5%',
    flexDirection: 'row',
    paddingTop: '2%', 
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: '3%',
  },
});

export default HandleGoBackReg;