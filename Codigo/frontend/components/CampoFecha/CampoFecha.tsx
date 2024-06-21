import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons'; // O importa desde donde tengas definido Ionicons
import { fechaToString } from '@/util/parserFechaToSring'; // Suponiendo que tienes un archivo de utilidades

interface Props {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const CampoFecha: React.FC<Props> = ({ date, setDate }) => {
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <>
      <View
        style={{
          width: "100%",
          backgroundColor: "white",
          padding: 15,
          borderRadius: 5,
        }}
      >
        <TouchableOpacity
          onPress={showDatepicker}
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text>{fechaToString(date)}</Text>
          <Ionicons
            name="calendar-clear-sharp"
            color={"black"}
            size={20}
          />
        </TouchableOpacity>
      </View>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={"date"}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </>
  );
};

export default CampoFecha;
