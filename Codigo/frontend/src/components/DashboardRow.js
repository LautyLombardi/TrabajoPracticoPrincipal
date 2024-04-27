import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DashboardRow = ({ id, name }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{id}</Text>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DashboardRow;
