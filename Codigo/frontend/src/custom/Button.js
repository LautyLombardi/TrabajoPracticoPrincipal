import React from 'react';
import { Text, Pressable } from 'react-native';

const Button = (props) => {
  const { onPress, styleText, styleContainer } = props;
  return (
    <Pressable style={styleContainer} onPress={onPress}>
      <Text style={styleText}>{title}</Text>
    </Pressable>
  );
}

export default Button;