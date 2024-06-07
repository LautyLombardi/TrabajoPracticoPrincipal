import axios from 'axios';
import { Empresa } from '../model/interfaces';
import { URL } from '@/api/constantes'
const BASE_URL = `${URL}/enterprice`;
import { getAdmDni } from './storage';

export async function createEmpresa(nombre: string, cuit: number): Promise<number> {
    try {
        const admDni = await getAdmDni();
        const response = await axios.post(BASE_URL,{
            "name": nombre,
            "cuit": cuit,
            "adm_dni":admDni
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        console.error('Error al obtener las empresas: ', error);
        return 400
    }
}