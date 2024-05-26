import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Logs } from '@/api/model/interfaces';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';

const AdministracionLogs = () => {
  const [logs, setLogs] = useState<Logs[]>([])

  useEffect(() => {
    //getInstitutos().then((institutes) => setInstitutos(institutes))
    // For now, we'll set some dummy data
    const dummyLogs = Array.from({ length: 10 }, (_, i) => ({
      id: i.toString(), // Convert id to string
      userId: 12345,
      exceptionId: 67890,
      visitorId: 11223,
      hasAccess: 1,
      isFaceRecognition: 1,
      abm: 'Lorem Ipsum',
      abmType: 'Type A',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      aperturaCierre: '09:00 - 18:00',
      createDate: new Date().toISOString(),
      isEnter: 1,
      isAutomatic: 1,
    }));
    setLogs(dummyLogs);
  }, []);

  const renderItem = ({ item }: { item: Logs }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='LOGS' route='menu' />

      <View style={styles.listContainer}>
        <FlatList
          data={logs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000051',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    height: '100%',
    width: '100%',
    paddingHorizontal: 10,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  itemText: {
    color: 'black',
  },
});

export default AdministracionLogs;
