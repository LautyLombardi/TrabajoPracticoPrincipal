//cantidad de usuarios AUTENTICADOS por el usuario logueado pero pudiendo establecer una fecha desde hasta separando ingresos de egresos 
//-hecho
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { StackedBarChart } from 'react-native-chart-kit';
import useGetLogsForAdmDni from '@/hooks/logs/useGetLogsForAdmDni';
import { Logs } from '@/api/model/interfaces';
import HandleGoBackReg from '@/components/handleGoBack/HandleGoBackReg';

interface vxd {
  [key: string]: {
    ingresos: number;
    egresos: number;
  };
} 
const ReportesHistoricos: React.FC = () => {
  const [fechas, setFechas] = useState<string[]>([]);
  const [ingresos, setIngresos] = useState<number[]>([]);
  const [egresos, setEgresos] = useState<number[]>([]);
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  const [filtroAplicado, setFiltroAplicado] = useState<boolean>(false);
  
  const [isDatePickerVisibleDesde, setDatePickerVisibilityDesde] = useState(false);
  const [isDatePickerVisibleHasta, setDatePickerVisibilityHasta] = useState(false);

  const [logsInfo, setLogsInfo] = useState<Logs[]>([])
  
  const getLogsForAdmDni = useGetLogsForAdmDni()

  useEffect(() => {
    const fetchLogs = async () => {
        const {logs} = await getLogsForAdmDni()
        if (logs) {
            setLogsInfo(logs)
        }
    }
    fetchLogs()
  }, [getLogsForAdmDni])

  const handleConfirmDesde = (date: Date) => {
    setFechaDesde(formatDate(date));
    setDatePickerVisibilityDesde(false);
  };

  const handleConfirmHasta = (date: Date) => {
    setFechaHasta(formatDate(date));
    setDatePickerVisibilityHasta(false);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleFiltrar = () => {
    if (logsInfo && logsInfo.length > 0) {
      const visitantesPorDia : vxd = {};

      logsInfo.forEach(log => {
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
    setFiltroAplicado(true);
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
      <HandleGoBackReg title='Reportes' route='reportes' />

      <View style={styles.formContainer}>
        <View style={styles.dateFilterContainer}>
          <Pressable onPress={() => setDatePickerVisibilityDesde(true)} style={styles.input}>
            <Text style={styles.inputText}>{fechaDesde || 'Fecha Desde (YYYY-MM-DD)'}</Text>
          </Pressable>
          <Pressable onPress={() => setDatePickerVisibilityHasta(true)} style={styles.input}>
            <Text style={styles.inputText}>{fechaHasta || 'Fecha Hasta (YYYY-MM-DD)'}</Text>
          </Pressable>
        </View>
        <Pressable onPress={handleFiltrar} style={styles.button}>
          <Text style={styles.buttonText}>Aplicar Filtro</Text>
        </Pressable>
      </View>
      
      <DateTimePickerModal
        isVisible={isDatePickerVisibleDesde}
        mode="date"
        onConfirm={handleConfirmDesde}
        onCancel={() => setDatePickerVisibilityDesde(false)}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisibleHasta}
        mode="date"
        onConfirm={handleConfirmHasta}
        onCancel={() => setDatePickerVisibilityHasta(false)}
      />
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Cantidad de visitantes AUTENTICADOS por el usuario logueado</Text>
        {filtroAplicado && (
          <StackedBarChart
            style={styles.chart}
            data={{
              labels: filteredDates,
              legend: ['Ingresos', 'Egresos'],
              data: filteredDates.map((_, index) => [filteredIngresos[index], filteredEgresos[index]]),
              barColors: ['#00FF00', '#0000FF'],
            }}
            width={300}
            height={200}
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
  dateFilterContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
    width: '100%',
  },
  inputText: {
    color: 'black',
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
    textAlign: "center",
  },
});

export default ReportesHistoricos;