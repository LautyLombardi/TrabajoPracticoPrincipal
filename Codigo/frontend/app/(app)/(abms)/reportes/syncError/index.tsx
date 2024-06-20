import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import useGetLogSyncError from '@/hooks/logs/useGetLogSyncError';
import { Logs } from '@/api/model/interfaces';
import HandleGoBackReg from '@/components/handleGoBack/HandleGoBackReg';

// Reporte Confidencial 2: reporte de errores de sincronización donde se muestra la
// información detallada de que paso al querer sincronizar (formato tabla)  
const SyncError = () => {
  const [logsTable, setLogsTable] = useState<Logs[]>([]);
  const getLogSyncError = useGetLogSyncError();

  useEffect(() => {
    const fetchLogs = async () => {
      const { logs } = await getLogSyncError();
      if (logs) {
        setLogsTable(logs)
      }
    }
    fetchLogs()
  }, [getLogSyncError])

  const renderTableRows = () => {
    return logsTable.map((log, index) => (
      <View key={index} style={styles.tableRow}>
        <Text style={styles.tableCell}>{log.id}</Text>
        <Text style={styles.tableCell}>{log.description}</Text>
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
            <Text style={styles.tableHeaderCell}>Descripción</Text>
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

export default SyncError;