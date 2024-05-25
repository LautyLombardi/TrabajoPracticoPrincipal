import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'

const pickDate = (fecha: Date, setFecha: (fecha:Date) => void) => {
    const onChange = (even: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setFecha(currentDate);
    };
    DateTimePickerAndroid.open({
        value: fecha,
        onChange,
        mode: 'date',
        is24Hour: true,
      });
}

export default pickDate;