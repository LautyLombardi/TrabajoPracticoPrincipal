//cantidad de usuarios AUTENTICADOS por el usuario logueado pero pudiendo establecer una fecha desde hasta separando ingresos de egresos -hecho
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, Button } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';
import { getLogs } from '@/api/services/log';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { getAdmDni } from '@/api/services/storage';

const ReportesHistoricos: React.FC = () => {
  const [fechas, setFechas] = useState<string[]>([]);
  const [ingresos, setIngresos] = useState<number[]>([]);
  const [egresos, setEgresos] = useState<number[]>([]);
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');

  const fetchData = async () => {
    const loges = await getLogs();
    const visitantesPorDia = {};
    const admDni = await getAdmDni();

    loges.forEach(visitante => {
      const fecha = visitante.createDate.split(' ')[0];
      if (visitante.visitorId != null && visitante.admDni == 1111) {
        if (!fechaDesde || !fechaHasta || (fecha >= fechaDesde && fecha <= fechaHasta)) {
          if (!visitantesPorDia[fecha]) {
            visitantesPorDia[fecha] = { ingresos: 0, egresos: 0 };
          }
          if (visitante.hasAccess === 1 && visitante.isEnter == 1) {
            visitantesPorDia[fecha].ingresos++;
          } else if (visitante.hasAccess === 1 && visitante.isEnter == 0) {
            visitantesPorDia[fecha].egresos++;
          }
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = () => {
    fetchData();
  };

  const data = {
    labels: fechas,
    legend: ["Ingresos", "Egresos"],
    data: fechas.map((fecha, index) => [ingresos[index], egresos[index]]),
    barColors: ['#1cc910', '#3498db'] // Verde para ingresos, azul para egresos
  };

  return (
    <View style={styles.container}>
      <HandleGoBack title='Reportes' route='reportes' />
      <View style={styles.dateInputsContainer}>
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
        <Button title="Aplicar" onPress={handleApply} />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.title}>//cantidad de usuarios AUTENTICADOS por el usuario logueado pero pudiendo establecer una fecha desde hasta separando ingresos de egresos</Text>
        <StackedBarChart
          data={data}
          width={Dimensions.get('window').width - 16}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1} // Ajustar el intervalo del eje Y
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            decimalPlaces: 0, // Asegurar que los números en el eje Y sean enteros
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForBackgroundLines: {
              strokeDasharray: "", // Opcional: Cambia esto si deseas líneas discontinuas
              strokeWidth: 1,
              stroke: "#c4c4c4",
              strokeOpacity: 1,
              strokeLinecap: "butt"
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          fromZero={true} // Comienza el eje Y desde cero
          showBarTops={true}
          showValuesOnTopOfBars={true}
        />
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
  dateInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    width: 150,
  },
  chartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ReportesHistoricos;

