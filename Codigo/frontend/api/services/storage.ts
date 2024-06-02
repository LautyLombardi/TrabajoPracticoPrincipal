import AsyncStorage from '@react-native-async-storage/async-storage';

//----------------------------local storage--------------------------
const getStorage = async (): Promise<string | null> => {
    try {
        const data = await AsyncStorage.getItem('adm_data');
        return data;
    } catch (error) {
        console.error('Error retrieving data from AsyncStorage', error);
        return null;
    }
}
export const getAbmDni = async (): Promise<string | null> => {
    try {
        const data = await AsyncStorage.getItem('adm_data');
        if (data) {
            const parsedData = JSON.parse(data);
            return parsedData.abm_dni;
        } else {
            console.log('No data found in AsyncStorage');
            return null;
        }
    } catch (error) {
        console.error('Error retrieving data from AsyncStorage', error);
        return null;
    }
}