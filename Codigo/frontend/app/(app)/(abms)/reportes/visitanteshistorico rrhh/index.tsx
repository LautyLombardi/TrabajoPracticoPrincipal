//el 1 de operativos pero de todos los usuarios, con el agregado de que se tenga un checkbox el cual si se lo tilda mostrara la informacion detallada de cada usuario en cada dia. Ademas ese reporte debe tener la opcion de poder exportar todo lo tildado a un archivo csv
//hecho
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Dimensions } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';
import { getLogs } from '@/api/services/log';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';

const ReportesHistoricosrrhh: React.FC = () => {
  const [fechas, setFechas] = useState<string[]>([]);
  const [ingresos, setIngresos] = useState<number[]>([]);
  const [egresos, setEgresos] = useState<number[]>([]);
  const [dni, setDni] = useState<number | null>(null);
  const [inputDni, setInputDni] = useState<string>('');

  const fetchData = async () => {
    const loges = await getLogs();
    const visitantesPorDia: { [key: string]: { ingresos: number, egresos: number } } = {};

    loges.forEach(visitante => {
      const fecha = visitante.createDate.split(' ')[0];
      if (visitante.hasAccess === 1 && visitante.visitorId != null && visitante.admDni === dni) {
        if (!visitantesPorDia[fecha]) {
          visitantesPorDia[fecha] = { ingresos: 0, egresos: 0 };
        }
        if (visitante.isEnter == 1) {
          visitantesPorDia[fecha].ingresos++;
        } else if (visitante.isEnter == 0) {
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
  };

  useEffect(() => {
    if (dni !== null) {
      fetchData();
    }
  }, [dni]);

  const handleApply = () => {
    const parsedDni = parseInt(inputDni, 10);
    if (!isNaN(parsedDni)) {
      setDni(parsedDni);
    } else {
      alert("Por favor, ingrese un DNI válido.");
    }
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ingrese DNI"
          value={inputDni}
          onChangeText={setInputDni}
          keyboardType="numeric"
        />
        <Button title="Aplicar" onPress={handleApply} />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Cantidad de usuarios AUTENTICADOS por el usuario que se quiera</Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 8,
    flex: 1,
  },
  chartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default ReportesHistoricosrrhh;

