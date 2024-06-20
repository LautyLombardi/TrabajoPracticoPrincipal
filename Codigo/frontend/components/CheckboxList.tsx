import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Checkbox from 'expo-checkbox';

const CheckboxList = ({ items, checkedList, onCheckboxChange }: any) => {
  return (
    <View style={styles.container}>
      {items.map((item: any, index: any) => (
        <View key={index} style={styles.checkboxContainer}>
          <Checkbox
            value={checkedList[index]}
            onValueChange={() => {
              const newCheckedList = [...checkedList];
              newCheckedList[index] = !newCheckedList[index];
              onCheckboxChange(newCheckedList);
            }}
            color={checkedList[index] ? '#800080' : undefined}
            style={styles.checkbox}
          />
          <Text style={styles.texto}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: "center",
    alignSelf: "center",
    flex: 1
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, 
    marginHorizontal: 10,
    flexBasis: 80
  },
  checkbox: {
    marginRight: 8,
  },
  texto: {
    fontSize: 16,
    color: "white"
  },
});

export default CheckboxList;