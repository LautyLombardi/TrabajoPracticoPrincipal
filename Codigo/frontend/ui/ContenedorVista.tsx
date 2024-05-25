import { View, Text, ViewProps, SafeAreaView } from 'react-native'
import React from 'react'


interface Props{
    children: React.ReactNode
} 

const ContenedorVista: React.FC<Props> = ({children}) => {
  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", backgroundColor: "#000051", paddingTop: 40, paddingHorizontal: 20 }}>
      {children}
    </SafeAreaView>
  )
}

export default ContenedorVista