import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../util/Colors';

const DateComponent = ({styleContainer, styleText}) => {
  // Obteniendo la fecha de hoy
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('es-ES', options);
  
  return (
    <View style={styleContainer}>
      <Text style={styleText}>Hoy es {formattedDate}</Text>
    </View>
  );
}

export default DateComponent;
