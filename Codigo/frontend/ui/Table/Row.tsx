import { View, Text } from 'react-native'
import React from 'react'

type PropsRow = {
    children: React.ReactNode;
  };
  
  const Row: React.FC<PropsRow> = ({ children }) => {
    return (
      <View style={{ flexDirection: 'row', borderBottomColor: 'white', borderBottomWidth: 2, alignItems: 'center' }}>
        {children}
      </View>
    );
  };

export default Row