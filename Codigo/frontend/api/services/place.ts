import axios from 'axios';
import { Lugar } from '@/api/model/interfaces';
import { URL } from '@/api/constantes'
const BASE_URL = `${URL}/place`;

export const getLugares = async (): Promise<Lugar[]> => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener los institutos');
    }
};