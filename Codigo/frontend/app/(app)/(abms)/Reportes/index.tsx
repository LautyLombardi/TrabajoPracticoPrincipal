import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { getVisitantes } from '@/api/services/visitantes';

const Reportes: React.FC = () => {
  const [fechas, setFechas] = useState<string[]>([]);
  const [numeros, setNumeros] = useState<number[]>([]);

  useEffect(() => {
    getVisitantes().then(visitantes => {
      const visitantesPorDia = {};
    
      visitantes.forEach(visitante => {
        const fecha = visitante.createDate.split(' ')[0];
        if (visitantesPorDia[fecha]) {
          visitantesPorDia[fecha]++;
        } else {
          visitantesPorDia[fecha] = 1;
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
    });

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Reportes de toke</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Reportes;
