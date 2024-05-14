import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { View, Text } from 'react-native';
interface SelectItemProps {
  fieldName: string;
  value: string;
  onValueChange: (value: string) => void;
  values: string[];
}

const SelectItem: React.FC<SelectItemProps> = ({ value, onValueChange, values, fieldName }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text
        style={{
          fontSize: 15,
          color: "white",
          textAlign: "center",
          textAlignVertical: "center",
          width: "25%"
        }}
      >
        {fieldName}
      </Text>
      <Picker
        style={{ flex: 1, backgroundColor: "white", color: "black", borderRadius: 100 }}
        selectedValue={value}
        onValueChange={(itemValue) => onValueChange(itemValue)}
      >
        {values.map((label, index) => (
          <Picker.Item key={index} label={label.toUpperCase()} value={label.toLowerCase()} />
        ))}
      </Picker>
    </View>
  );
};

export default SelectItem;
