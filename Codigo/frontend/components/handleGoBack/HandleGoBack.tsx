import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

type PropsGoBack = {
  title: string,
  route: string,
}

const HandleGoBack: React.FC<PropsGoBack> = ({ title = "Menu", route="menu" }) => {
  const goBack = () => {
      
  }

  return (
    <View style={styles.container}>
      <Ionicons name='arrow-back-outline' style={styles.backButton} size={25} onPress={()=> router.navigate(`/${route}`)} />
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

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
    fontSize: 18, 
    marginLeft: '3%'
  },
  backButton:{
    margin: 5    
  }
})

export default HandleGoBack