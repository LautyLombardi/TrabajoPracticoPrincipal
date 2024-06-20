import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { StackedBarChart } from 'react-native-chart-kit';
import useGetLogsForReport from '@/hooks/logs/useGetLogsForReport';
import { Logs } from '@/api/model/interfaces';

interface vxd {
  [key: string]: {
    ingresos: number;
    egresos: number;
  };
} 
// Reporte Getion 1: cantidad de visitantes AUTENTICADOS por el usuario logueado
// (ya sea ingreso o egreso) historico separando ingresos de egresos, con el agregado 
// de que se tenga un checkbox el cual si se lo tilda mostrará la información de
// cada usuario en cada dia. Además ese reporte debe tener la opción de poder exportar todo
// lo tildado a un archivo csv, (LO DE CSV SI NO SE PUEDE QUEDAR COMO CAMBIO PENDIENTE)
const ReportesHistoricos = () => {
  const [fechas, setFechas] = useState<string[]>([]);
  const [ingresos, setIngresos] = useState<number[]>([]);
  const [egresos, setEgresos] = useState<number[]>([]);
  const [dni, setDni] = useState<number | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState<boolean>(false);
  const [logsInfo, setLogsInfo] = useState<Logs[]>([]);
  const [logsTable, setLogsTable] = useState<Logs[]>([]);

  const getLogsForReport = useGetLogsForReport();

  useEffect(() => {
    const fetchLogs = async () => {
        const { logs } = await getLogsForReport();
        if (logs) {
          setLogsInfo(logs);
          setLogsTable(logs)
          const visitantesPorDia: vxd = {};
          logs.forEach(log => {
            const fecha = log.createDate.split(' ')[0];
            if (log.visitorId != null) {
              if (!visitantesPorDia[fecha]) {
                visitantesPorDia[fecha] = { ingresos: 0, egresos: 0 };
              }
              if (log.hasAccess === 1 && log.isEnter === 1) {
                visitantesPorDia[fecha].ingresos++;
              } else if (log.hasAccess === 1 && log.isEnter === 0) {
                visitantesPorDia[fecha].egresos++;
              }
            }
          });

          const fechasArray = Object.keys(visitantesPorDia).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA.getTime() - dateB.getTime();
          });

          const ingresosArray = fechasArray.map(fecha => visitantesPorDia[fecha].ingresos);
          const egresosArray = fechasArray.map(fecha => visitantesPorDia[fecha].egresos);
        
          setFechas(fechasArray);
          setIngresos(ingresosArray);
          setEgresos(egresosArray);
        }
    }
    fetchLogs()
  }, [getLogsForReport])

  const handleFiltrar = () => {
    if (logsInfo && logsInfo.length > 0) {
      const visitantesPorDia: vxd = {};
      
      const filteredLogs = logsInfo.filter(log => {
        return log.visitorId != null && (dni === log.admDni || dni === null);
      });    
      console.log('filteredLogs',filteredLogs)
      setLogsTable(filteredLogs);

      logsInfo.forEach(log => {
        const fecha = log.createDate.split(' ')[0];
        if (log.visitorId != null && (dni === log.admDni || dni === null)) {
          if (!visitantesPorDia[fecha]) {
            visitantesPorDia[fecha] = { ingresos: 0, egresos: 0 };
          }
          if (log.hasAccess === 1 && log.isEnter === 1) {
            visitantesPorDia[fecha].ingresos++;
          } else if (log.hasAccess === 1 && log.isEnter === 0) {
            visitantesPorDia[fecha].egresos++;
          }
        }
      });

      const fechasArray = Object.keys(visitantesPorDia).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
      });

      const ingresosArray = fechasArray.map(fecha => visitantesPorDia[fecha].ingresos);
      const egresosArray = fechasArray.map(fecha => visitantesPorDia[fecha].egresos);

      setFechas(fechasArray);
      setIngresos(ingresosArray);
      setEgresos(egresosArray);
    }
  };

  const renderTableRows = () => {
    return logsTable.map((log, index) => (
      <View key={index} style={styles.tableRow}>
        <Text style={styles.tableCell}>{log.id}</Text>
        <Text style={styles.tableCell}>{log.admDni}</Text>
        <Text style={styles.tableCell}>{log.visitorId}</Text>
        <Text style={styles.tableCell}>{log.isEnter === 1 ? 'Ingreso' : 'Egreso'}</Text>
      </View>
    ));
  };

  const validData = fechas.length > 0 && ingresos.length > 0 && egresos.length > 0;

  return (
    <View style={styles.container}>
      <HandleGoBack title='Reportes' route='reportes' />
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>DNI: </Text>
          <TextInput
            style={styles.input}
            placeholder='00000000'
            placeholderTextColor="gray"
            value={dni ? dni.toString() : ''}
            onChangeText={(text) => {
              const parsedDni = parseInt(text, 10);
              if (!isNaN(parsedDni)) {
                setDni(parsedDni);
              } else {
                setDni(null);
              }
            }}
            keyboardType="numeric"
          />
        </View>
        <Pressable onPress={handleFiltrar} style={styles.button}>
          <Text style={styles.buttonText}>Aplicar Filtro</Text>
        </Pressable>
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Cantidad de usuarios AUTENTICADOS por el usuario logueado</Text>
        {validData ? (
          <StackedBarChart
            style={styles.chart}
            data={{
              labels: fechas,
              legend: ['Ingresos', 'Egresos'],
              data: fechas.map((_, index) => [ingresos[index], egresos[index]]),
              barColors: ['#00FF00', '#0000FF'],
            }}
            width={300}
            height={200}
            yAxisLabel="Cantidad"
            yLabelsOffset={5}
            hideLegend={false}
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForBackgroundLines: {
                strokeDasharray: '', // solid background lines with no dashes
              },
              barPercentage: 0.5,
              useShadowColorFromDataset: false,
              style: {
                borderRadius: 16,
              },
            }}
          />
        ) : (
          <Text style={styles.title}>No hay datos disponibles</Text>
        )}
      </View>
      
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={mostrarDetalle}
          onValueChange={() => setMostrarDetalle(!mostrarDetalle)}
        />
        <Text style={styles.checkboxLabel}>Mostrar detalle</Text>
      </View>
      {mostrarDetalle && 
        <ScrollView style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>ID</Text>
            <Text style={styles.tableHeaderCell}>ADM DNI</Text>
            <Text style={styles.tableHeaderCell}>Visitor ID</Text>
            <Text style={styles.tableHeaderCell}>Ingreso/Egreso</Text>
          </View>
          {renderTableRows()}
        </ScrollView>
      }  
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
  formContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '90%',
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#000051',
    fontSize: 16,
  },
  inputContainer: {
    height: 70,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  labelText: {
    color: "white",
    fontSize: 15,
    textAlign: "left",
    width: "30%",
    marginRight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    flex: 1,
    borderRadius: 5,
    color: 'black',
    justifyContent: 'center',
  },
  chartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  chart: {
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: '48%',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: '2%',
    color: "white",
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

export default ReportesHistoricos;