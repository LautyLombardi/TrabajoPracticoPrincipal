import axios from 'axios';
import { Empresa } from '../model/interfaces';
import { URL } from '@/api/constantes'
const BASE_URL = `${URL}/enterprice`;

export async function getEmpresas(): Promise<Empresa[]> {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las empresas: ', error);
        return [];
    }
}