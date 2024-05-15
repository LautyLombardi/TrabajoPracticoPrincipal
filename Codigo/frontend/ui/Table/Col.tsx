import { View, Text } from 'react-native'
import React from 'react'

type PropsCol = {
    text?: string,
    flexWidth?: number,
    icon?: React.ReactNode
  };
  
  const Col: React.FC<PropsCol> = ({text, flexWidth = 1, icon}) => {
  
    const renderChildren = () => {
      if((text || text=='') && !icon){
        return (
        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold', textAlign: "center", textAlignVertical: "center", padding: 11 }}>{text}</Text>
        )
      }else{
        if(icon){
          return (icon) 
        }else {
          return <Text></Text>
        }
      }
    }
  
    return (
      <View style={{ flex: flexWidth, paddingVertical: 12, justifyContent: "center", alignItems: "center" }}>
          {renderChildren()}
      </View>
    );
  };

export default Col