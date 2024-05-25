import { TouchableOpacity, StyleSheetProperties, GestureResponderEvent, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import React from 'react'

interface BotonProps {
    children?: React.ReactNode | undefined
    styles?: StyleProp<ViewStyle> | undefined,
    onPress?: ((event: GestureResponderEvent) => void) | undefined
}

const Boton: React.FC<BotonProps> = (props) => {
    return (
        <TouchableOpacity style={[stylesBase.boton, props.styles]} onPress={props.onPress}>
            {props.children}
        </TouchableOpacity>
    )
}

const stylesBase = StyleSheet.create({
  boton: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }  
})

export default Boton