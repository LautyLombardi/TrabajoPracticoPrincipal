import {Picker} from '@react-native-picker/picker'
import { useState } from 'react';
import { StyleProps } from 'react-native-reanimated';

const Item: any = Picker.Item;

interface Props{
    valor: any,
    setValor: any,
    itemList: any[],
    style?: StyleProps
}

export const DropdownPicker: React.FC<Props> = ({valor, setValor, itemList, style}) => {
  
    return <>
      <Picker
      
      style={[{backgroundColor: "white", flex:1, borderRadius: 20}, style]}
        selectedValue={valor}
        onValueChange={(v) => setValor(v)}
        mode="dropdown">
        {
            itemList?.map((item) => <Item key={item.id} label={item.name} value={item.name}/>)
        }
      </Picker>
    </>
    }