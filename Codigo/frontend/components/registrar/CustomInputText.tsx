import { View, Text, TextInput } from 'react-native'
import React from 'react'

const CustomInputText = ({ label, value, onChangeText }: any) => {
        return (
          <View
            style={{
              height: 70,
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
              paddingHorizontal: 10,
            }}
          >
            <View style={{ width: 80 }}>
              <Text style={{ color: "white", fontSize: 15 }}>{label}</Text>
            </View>
            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                flex: 2,
                borderRadius: 5,
              }}
            >
              <TextInput placeholder={value} placeholderTextColor={"gray"} onChangeText={(text) => onChangeText(text)}/>
            </View>
          </View>
        );
};
  

export default CustomInputText