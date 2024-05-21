import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { StyleProps } from "react-native-reanimated";

type Prop = {
  style?: StyleProps;
  backgroundColor?: string;
  hoverColor?: string,
  borderRadius?: number | undefined;
  borderWidth?: number | undefined;
  borderColor?: string;
  padding?: number | undefined;

  styleText?: StyleProps;
  color?: string;
  fontSze?: number | undefined;
  textAlign?: "center" | "left" | "right" | undefined;
  textAignVertical?: "center" | "bottom" | "top" | undefined;

  onPress?: () => void;

  text?: string
};

const Boton: React.FC<Prop> = (prop: Prop): JSX.Element => {
  const [hoverOn, setHoverOn] = useState(false);

  return (
    <Pressable onPress={prop.onPress} onHoverIn={() => setHoverOn(true)} onHoverOut={() => setHoverOn(false)}>
      <View
        style={[
          {
            backgroundColor: hoverOn ? prop.hoverColor : prop.backgroundColor,
            borderColor: prop.borderColor,
            borderWidth: prop.borderWidth,
            borderRadius: prop.borderRadius,
            padding: prop.padding,
          },
          prop.style,
        ]}
      >
        <Text
          style={[
            {
              color: prop.color,
              fontSize: prop.fontSze,
              textAlign: prop.textAlign,
              textAlignVertical: prop.textAignVertical,
            },
            prop.styleText,
          ]}
        >
          {prop.text}
        </Text>
      </View>
    </Pressable>
  );
};

export default Boton;
