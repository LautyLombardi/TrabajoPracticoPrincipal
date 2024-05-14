import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const Header = ({handleGoBack}: any) => {
  return (
    <View
    style={{
      height: 50,
      backgroundColor: "white",
      width: "100%",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: 10,
      flexDirection: "row",
      gap: 10,
    }}
  >
    <Ionicons name="arrow-back-outline" size={20} onPress={handleGoBack} />
    <Text style={{ fontWeight: "bold" }}>Registro Empresa</Text>
  </View>
  )
}

export default Header