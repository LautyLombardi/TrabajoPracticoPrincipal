import axios from 'axios';
import { URL } from '@/api/constantes'
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
        const storageData = await getStorage();
        console.log('Raw storage data:', storageData); // Log para ver los datos crudos
        if (storageData) {
            const parsedData = JSON.parse(storageData);
            console.log('Parsed storage data:', parsedData); // Log para ver los datos parseados
            console.log('adm_dni:', parsedData.adm_dni); // Log para ver el campo específico
            return parsedData.adm_dni;
        } else {
            console.log('No data found in AsyncStorage');
            return null;
        }
    } catch (error) {
        console.error('Error retrieving data from AsyncStorage', error);
        return null;
    }
}
//--------------------------------------------------------- 

export async function openDay(): Promise<number> {
    try {
        const response = await axios.post(`${URL}/open_day`, {
            "adm_dni": getAbmDni()
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        return 403;
    }
}

export async function closeDay(): Promise<number> {
    try {
        const response = await axios.post(`${URL}/close_day`, {
            "adm_dni": getAbmDni()
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        return 403;
    }
}

export async function statusDay(): Promise<number> {
    try {
        const response = await axios.get(`${URL}/status_dia`);
        return response.status;
    } catch (error) {
        return 403;
    }
}