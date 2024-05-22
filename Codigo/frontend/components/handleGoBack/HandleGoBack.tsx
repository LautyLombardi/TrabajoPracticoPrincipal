import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

type PropsGoBack = {
  title: string,
  route: string,
}

const HandleGoBack: React.FC<PropsGoBack> = ({ title, route }) => {
  const goBack = () => {
    const canGoBack = router.canGoBack()
    if (canGoBack) {
      router.back()
    } else {
      router.navigate(`/${route}`)
    }
  }

  return (
    <View style={styles.container}>
      <Ionicons name='arrow-back-outline' size={25} onPress={goBack} />
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '9%',
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    flexDirection: 'row',
    marginVertical: '2%',
    paddingTop: '6%'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16, 
    marginLeft: '3%'
  },
})
export default HandleGoBack