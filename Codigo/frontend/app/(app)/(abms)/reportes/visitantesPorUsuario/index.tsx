import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';
import useGetLogsForAdmDni from '@/hooks/logs/useGetLogsForAdmDni';
import HandleGoBackReg from '@/components/handleGoBack/HandleGoBackReg';

interface vxd {
  [key: string]: {
    ingresos: number;
    egresos: number;
  };
} 
// Reporte Operativo 1: cantidad de visitantes AUTENTICADOS por el usuario
// logueado (ya sea ingreso o egreso) historico separando ingresos de egresos
const VisitantesPorUsuario = () => {
  const [fechas, setFechas] = useState<string[]>([]);
  const [ingresos, setIngresos] = useState<number[]>([]);
  const [egresos, setEgresos] = useState<number[]>([]);
  
  const getLogsForAdmDni = useGetLogsForAdmDni();

  useEffect(() => {
    const fetchLogs = async () => {
        const { logs } = await getLogsForAdmDni();
        if (logs) {
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
  }, [getLogsForAdmDni])

  // Verifica que no haya valores NaN en los datos
  const validData = fechas.length > 0 && ingresos.length > 0 && egresos.length > 0;

  return (
    <View style={styles.container}>
      <HandleGoBackReg title='Reportes' route='reportes' />
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Total de visitantes AUTENTICADOS por el usuario logueado</Text>
        {validData ? (
          <StackedBarChart
            style={styles.chart}
            data={{
              labels: fechas,
              legend: ['Ingresos', 'Egresos'],
              data: fechas.map((_, index) => [ingresos[index], egresos[index]]),
              barColors: ['#00FF00', '#0000FF'],
            }}
            width={Dimensions.get('window').width - 30}
            height={400}
            yAxisLabel=""
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
});

export default VisitantesPorUsuario;
