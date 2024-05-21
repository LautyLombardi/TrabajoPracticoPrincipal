import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';

interface LugaresCheckBoxProps {
  lugares: string[];
  lugaresSeleccionados: string[];
  onLugarToggle: (lugar: string) => void;
}

const LugaresCheckBox: React.FC<LugaresCheckBoxProps> = ({ lugares, lugaresSeleccionados, onLugarToggle }) => {
  return (
    <View style={{gap:10, flexWrap: 'wrap', flexDirection: "row", padding: 20}}>
      {lugares.map((lugar, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Checkbox
            value={lugaresSeleccionados.includes(lugar)}
            onValueChange={() => onLugarToggle(lugar)}
          />
          <Text style={{color: "white", padding: 5}}>{lugar}</Text>
        </View>
      ))}
    </View>
  );
};

export default LugaresCheckBox;
