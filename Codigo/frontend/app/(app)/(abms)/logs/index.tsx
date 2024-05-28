import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Logs } from '@/api/model/interfaces';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { getLogs } from '@/api/services/log';

const AdministracionLogs = () => {
  const [logs, setLogs] = useState<Logs[]>([]);

  useEffect(() => {
    getLogs().then((logs) => setLogs(logs));
  }, []);

  const renderItem = ({ item }: { item: Logs }) => {
    const renderText = (label: string, value: any) => {
      if (value === null) return null;
      if (value === 0) return `${label}: No`;
      if (value === 1) return `${label}: Sí`;
      return `${label}: ${value}`;
    };

    return (
      <View style={styles.itemContainer}>
        {item.userId !== null && <Text style={styles.itemText}>{renderText('Usuario DNI', item.userId)}</Text>}
        {item.abm && <Text style={styles.itemText}>{item.abm}</Text>}
        {item.description && <Text style={styles.itemText}>{item.description}</Text>}
        {item.abmType && <Text style={styles.itemText}>{renderText('Tipo de ABM', item.abmType)}</Text>}
        {item.aperturaCierre && <Text style={styles.itemText}>{renderText('Apertura/Cierre', item.aperturaCierre)}</Text>}
        {item.createDate && <Text style={styles.itemText}>{renderText('Creación', item.createDate)}</Text>}
        {item.exceptionId !== null && <Text style={styles.itemText}>{renderText('Exception ID', item.exceptionId)}</Text>}
        {item.hasAccess !== null && <Text style={styles.itemText}>{renderText('Tiene Acceso', item.hasAccess)}</Text>}
        {item.isAutomatic !== null && <Text style={styles.itemText}>{renderText('Es Automatico', item.isAutomatic)}</Text>}
        {item.isEnter !== null && <Text style={styles.itemText}>{renderText('Is Enter', item.isEnter)}</Text>}
        {item.isFaceRecognition !== null && <Text style={styles.itemText}>{renderText('Reconocimiento Facial', item.isFaceRecognition)}</Text>}
        {item.visitorId !== null && <Text style={styles.itemText}>{renderText('Visitante DNI', item.visitorId)}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='LOGS' route='menu' />

      <View style={styles.listContainer}>
        <FlatList
          data={logs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

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
