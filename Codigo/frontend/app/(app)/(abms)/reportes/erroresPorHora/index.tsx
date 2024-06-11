// App.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CheckBox } from 'react-native-elements';
import useGetLogs from '@/hooks/logs/useGetLogs'; // Asegúrate de importar correctamente
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { getAdmDni } from '@/api/services/storage';
import { BarChart } from 'react-native-chart-kit';

const ReportesHistoricos: React.FC = () => {
  const [fechas, setFechas] = useState<string[]>([]);
  const [errores, setErrores] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);
  const { logs, isLoading, isError } = useGetLogs(); // Utiliza el custom hook

  const filterLogs = (logs: any) => {
    const erroresPorDia: any = {};

    logs.forEach(visitante => {
      const [date, time] = visitante.createDate.split(' ');
      const hour = parseInt(time.split(':')[0], 10);

      let shouldInclude = false;
      if (selectedFilter === 1 && hour >= 0 && hour < 8) {
        shouldInclude = true;
      } else if (selectedFilter === 2 && hour >= 8 && hour < 16) {
        shouldInclude = true;
      } else if (selectedFilter === 3 && (hour >= 16 || hour < 8)) {
        shouldInclude = true;
      }

      if (visitante.isError === 1 && shouldInclude) {
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

  useEffect(() => {
    if (!isLoading && !isError && logs) {
      filterLogs(logs);
    }
  }, [logs, isLoading, isError, selectedFilter]);

  const handleFilterChange = (filter: any) => {
    setSelectedFilter(filter);
  };

  return (
    <View style={styles.container}>
      <HandleGoBack title='Reportes' route='reportes' />
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Seleccione un filtro de hora:</Text>
        <CheckBox
          title="00:00 - 08:00"
          checked={selectedFilter === 1}
          onPress={() => handleFilterChange(1)}
        />
        <CheckBox
          title="08:00 - 16:00"
          checked={selectedFilter === 2}
          onPress={() => handleFilterChange(2)}
        />
        <CheckBox
          title="16:00 - 00:00"
          checked={selectedFilter === 3}
          onPress={() => handleFilterChange(3)}
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Cantidad de Errores por Día</Text>
        {fechas.length > 0 && (
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
            width={Dimensions.get('window').width - 16} // from react-native
            height={220}
            yAxisLabel=""
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
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
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
