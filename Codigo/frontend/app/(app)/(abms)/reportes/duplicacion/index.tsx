import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import useGetLogsDuplicacion from '@/hooks/logs/useGetLogsDuplicacion';
import { Logs } from '@/api/model/interfaces';
import HandleGoBackReg from '@/components/handleGoBack/HandleGoBackReg';

// Reporte Confidencial 1: cambios realizados por la funcionalidad de duplicación 
// de visitantes o usuarios (básicamente un reporte que muestra los logs  
// referentes a cambios hechos por los de RR. HH. con esa funcionalidad) 
// ESTE ES EL ÚNICO REPORTE QUE SE MANDA POR EL MAIL CONFIGURADO    
const Duplicacion = () => {
  const [logsTable, setLogsTable] = useState<Logs[]>([]);
  const getLogsForDuplicacion = useGetLogsDuplicacion();

  useEffect(() => {
    const fetchLogs = async () => {
      const { logs } = await getLogsForDuplicacion();
      if (logs) {
        setLogsTable(logs)
      }
    }
    fetchLogs()
  }, [getLogsForDuplicacion])

  const renderTableRows = () => {
    return logsTable.map((log, index) => (
      <View key={index} style={styles.tableRow}>
        <Text style={styles.tableCell}>{log.id}</Text>
        <Text style={styles.tableCell}>{log.admDni}</Text>
        <Text style={styles.tableCell}>{log.visitorId || log.userId}</Text>
        <Text style={styles.tableCell}>{log.abm}</Text>
        <Text style={styles.tableCell}>{log.abmType}</Text>
        <Text style={styles.tableCell}>{log.description}</Text>
        <Text style={styles.tableCell}>{log.isError === 1 ? 'Si' : 'No'}</Text>
        <Text style={styles.tableCell}>{log.createDate}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <HandleGoBackReg title='Reportes' route='reportes' />
        <ScrollView style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>ID</Text>
            <Text style={styles.tableHeaderCell}>ADM DNI</Text>
            <Text style={styles.tableHeaderCell}>DNI</Text>
            <Text style={styles.tableHeaderCell}>ABM</Text>
            <Text style={styles.tableHeaderCell}>Tipo de ABM</Text>
            <Text style={styles.tableHeaderCell}>Descripción</Text>
            <Text style={styles.tableHeaderCell}>Es error</Text>
            <Text style={styles.tableHeaderCell}>Fecha de creación</Text>
          </View>
          {renderTableRows()}
        </ScrollView> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00759c',
    flex: 1,
    paddingVertical: 30,
    alignItems: 'center',
  },
  tableContainer: {
    marginTop: 20,
    width: '90%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    padding: 10,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default Duplicacion;