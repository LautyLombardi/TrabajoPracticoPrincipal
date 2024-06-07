import AsyncStorage from '@react-native-async-storage/async-storage';

//----------------------------local storage--------------------------
export const getStorage = async (): Promise<string | null> => {
    try {
        const data = await AsyncStorage.getItem('adm_data');
        return data;
    } catch (error) {
        console.error('Error retrieving data from AsyncStorage', error);
        return null;
    }
}

export const getAdmDni = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('adm_data');
      if (jsonValue != null) {
        const admData = JSON.parse(jsonValue);
        const dataInt=parseInt(admData[0].adm_dni) // Suponiendo que siempre hay un objeto en el array
        return dataInt; 
      }
      return null; // Retorna null si no hay datos
    } catch (e) {
      console.log(e);
      return null;
    }
  };