//hecho
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import useGetLogs from '@/hooks/logs/useGetLogs'; // Asegúrate de importar correctamente
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { getAdmDni } from '@/api/services/storage';
import { StackedBarChart } from 'react-native-chart-kit';

const ReportesHistoricos: React.FC = () => {
  const [fechas, setFechas] = useState<string[]>([]);
  const [ingresos, setIngresos] = useState<number[]>([]);
  const [egresos, setEgresos] = useState<number[]>([]);
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  const [dni, setDni] = useState<number | null>(null);
  const [filtroAplicado, setFiltroAplicado] = useState<boolean>(false);
  const { logs, isLoading, isError } = useGetLogs(); // Utiliza el custom hook

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoading && !isError && logs) {
        const visitantesPorDia = {};
        const admDni = await getAdmDni();

        logs.forEach(visitante => {
          const fecha = visitante.createDate.split(' ')[0];
          if (visitante.visitorId != null && (dni === null || visitante.admDni === dni)) {
              if (!visitantesPorDia[fecha]) {
                  visitantesPorDia[fecha] = { ingresos: 0, egresos: 0 };
              }
              if (visitante.hasAccess === 1 && visitante.isEnter == 1) {
                  visitantesPorDia[fecha].ingresos++;
              } else if (visitante.hasAccess === 1 && visitante.isEnter == 0) {
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

    fetchData();
  }, [logs, isLoading, isError, dni]);

  const handleFiltrar = () => {
    setFiltroAplicado(true);
  };

  const handleLimpiarFiltro = () => {
    setFiltroAplicado(false);
    setFechaDesde('');
    setFechaHasta('');
    setDni(null);
  };

  const filteredDates = fechas.filter(fecha => {
    const fechaDate = new Date(fecha);
    const desdeDate = new Date(fechaDesde);
    const hastaDate = new Date(fechaHasta);
    return fechaDate >= desdeDate && fechaDate <= hastaDate;
  });

  const filteredIngresos = filteredDates.map(fecha => ingresos[fechas.indexOf(fecha)]);
  const filteredEgresos = filteredDates.map(fecha => egresos[fechas.indexOf(fecha)]);

  return (
    <View style={styles.container}>
      <HandleGoBack title='Reportes' route='reportes' />
      <View style={styles.filtersContainer}>
        <View style={styles.dateFilterContainer}>
          <TextInput
            style={styles.input}
            placeholder="Fecha Desde (YYYY-MM-DD)"
            value={fechaDesde}
            onChangeText={setFechaDesde}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha Hasta (YYYY-MM-DD)"
            value={fechaHasta}
            onChangeText={setFechaHasta}
          />
        </View>
        <View style={styles.dniFilterContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ingrese DNI"
            keyboardType="numeric"
            value={dni ? dni.toString() : ''}
            onChangeText={(text) => {
              const parsedDni = parseInt(text, 10);
              if (!isNaN(parsedDni)) {
                setDni(parsedDni);
              } else {
                setDni(null);
              }
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Aplicar Filtro" onPress={handleFiltrar} />
          <Button title="Limpiar Filtro" onPress={handleLimpiarFiltro} />
        </View>
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Cantidad de usuarios AUTENTICADOS por el usuario logueado</Text>
        {filtroAplicado && (
          <StackedBarChart
            style={styles.chart}
            data={{
              labels: filteredDates,
              legend: ['Ingresos', 'Egresos'],
              data: [filteredIngresos, filteredEgresos],
              barColors: ['#00FF00', '#0000FF'],
            }}
            width={300}
            height={200}
            yAxisLabel="Cantidad"
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  dateFilterContainer: {
    flexDirection: 'row',
  },
  dniFilterContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 8,
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

