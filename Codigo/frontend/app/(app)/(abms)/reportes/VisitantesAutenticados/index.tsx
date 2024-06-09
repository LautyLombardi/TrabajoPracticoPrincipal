import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, Button } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { getLogs } from '@/api/services/log';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';

const ReportesVisitantes: React.FC = () => {
  const [fechas, setFechas] = useState<string[]>([]);
  const [numeros, setNumeros] = useState<number[]>([]);
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');

  const fetchData = async () => {
    const loges = await getLogs();
    const visitantesPorDia = {};

    loges.forEach(visitante => {
      const fecha = visitante.createDate.split(' ')[0];
      if (visitante.hasAccess === 1 && visitante.visitorId != null /* and visitante.ADMDni=admdni*/) {
        if (fecha >= fechaDesde && fecha <= fechaHasta) {
          if (visitantesPorDia[fecha]) {
            visitantesPorDia[fecha]++;
          } else {
            visitantesPorDia[fecha] = 1;
          }
        }
      }
    });

    const fechasArray = Object.keys(visitantesPorDia).sort((a, b) => {
      // Convertir las fechas de cadena de texto a objetos de fecha
      const dateA = new Date(a);
      const dateB = new Date(b);
      // Ordenar los objetos de fecha de menor a mayor
      return dateA.getTime() - dateB.getTime();
    });
    
    const numerosArray = fechasArray.map(fecha => visitantesPorDia[fecha]);

    setFechas(fechasArray);
    setNumeros(numerosArray);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = {
    labels: fechas,
    datasets: [
      {
        label: "pv",
        data: numeros
      }
    ]
  };

  const handleApply = () => {
    fetchData();
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
        <Text style={styles.title}>Visitantes * Día de usuario logueado</Text>
        <BarChart
          data={data}
          width={Dimensions.get('window').width - 16}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            decimalPlaces: 0,
            color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          fromZero={true}
          showValuesOnTopOfBars={true}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
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

export default ReportesVisitantes;
