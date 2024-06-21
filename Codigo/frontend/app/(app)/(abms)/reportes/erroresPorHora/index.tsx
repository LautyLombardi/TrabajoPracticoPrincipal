import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CheckBox } from 'react-native-elements';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { BarChart } from 'react-native-chart-kit';
import { Logs } from '@/api/model/interfaces';
import useGetLogSyncError from '@/hooks/logs/useGetLogSyncError';

// Reporte Confidencial 3: reporte de cantidad errores de sincronización por día y hora 
// con el gráfico de calor que nos indicó el profe (osea es un coso de barras o calor o
// parecido q te dice cuántos errores de sincro hay en cada día de la semana y en cada hora)
const ReportesHistoricos: React.FC = () => {
  const [fechas, setFechas] = useState<string[]>([]);
  const [errores, setErrores] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<number>(0);
  const [logsInfo, setLogsInfo] = useState<Logs[]>([]);
  const getLogSyncError = useGetLogSyncError();

  useEffect(() => {
    const fetchLogs = async () => {
      const { logs } = await getLogSyncError();
      if (logs) {
        setLogsInfo(logs)
      }
    }
    fetchLogs()
  }, [getLogSyncError])

  const filterLogs = (filter: number) => {
    setSelectedFilter(filter);
    const erroresPorDia: any = {};

    logsInfo.forEach(log => {
      const [date, time] = log.createDate.split(' ');
      const hour = parseInt(time.split(':')[0], 10);

      let shouldInclude = false;
      if (filter === 1 && hour >= 0 && hour < 8) {
        shouldInclude = true;
      } else if (filter === 2 && hour >= 8 && hour < 16) {
        shouldInclude = true;
      } else if (filter === 3 && (hour >= 16 || hour < 8)) {
        shouldInclude = true;
      }

      if (log.isError === 1 && shouldInclude) {
        if (!erroresPorDia[date]) {
          erroresPorDia[date] = 0;
        }
        erroresPorDia[date]++;
      }
    });

    const fechasArray = Object.keys(erroresPorDia).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });

    const erroresArray = fechasArray.map(fecha => erroresPorDia[fecha]);

    setFechas(fechasArray);
    setErrores(erroresArray);
  };

  return (
    <View style={styles.container}>
      <HandleGoBack title='Reportes' route='reportes' />
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Seleccione un filtro de hora:</Text>
        <CheckBox
          title="00:00 - 08:00"
          checked={selectedFilter === 1}
          onPress={() => filterLogs(1)}
        />
        <CheckBox
          title="08:00 - 16:00"
          checked={selectedFilter === 2}
          onPress={() => filterLogs(2)}
        />
        <CheckBox
          title="16:00 - 00:00"
          checked={selectedFilter === 3}
          onPress={() => filterLogs(3)}
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Cantidad de Errores de Sincronización por Día y Hora</Text>
        {fechas.length > 0 ? (
          <BarChart
            style={styles.chart}
            data={{
              labels: fechas,
              datasets: [
                {
                  data: errores,
                },
              ],
            }}
            width={Dimensions.get('window').width - 16}
            height={300}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
          />
        ) : (
          <Text style={styles.title}>No hay datos disponibles</Text>
        )}
      </View>
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
  filtersContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ReportesHistoricos;
