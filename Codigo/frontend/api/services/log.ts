import axios from 'axios';
import { Logs } from '../model/interfaces';
import { URL } from '@/api/constantes'
const BASE_URL = `${URL}/logs`;

export async function getLogs(): Promise<Logs[]> {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los logs: ', error);
        return [];
    }
}