import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { View, Text } from 'react-native';

interface SelectItemProps {
  value: string;
  onValueChange: (value: string) => void;
}

const SelectItem: React.FC<SelectItemProps> = ({ value, onValueChange }) => {
  return (<>
      <Text
        style={{
          fontSize: 15,
          color: "white",
          textAlign: "center",
          textAlignVertical: "center",
          width: 80
        }}
      >
        Categoría
      </Text>
      <Picker
        style={{ flex: 1, backgroundColor: "white", color: "black", borderRadius: 100 }} 
        selectedValue={value}
        onValueChange={(itemValue) => onValueChange(itemValue)}
      >
        <Picker.Item label="Interno" value="interno" />
        <Picker.Item label="Externo" value="externo" />
      </Picker>
  </>);
};

export default SelectItem;
