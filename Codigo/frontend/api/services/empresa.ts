import axios from 'axios';
import { Empresa } from '../model/interfaces';
import { URL } from '@/api/constantes'
const BASE_URL = `${URL}/enterprice`;
import { getAbmDni } from './storage';

export async function getEmpresas(): Promise<Empresa[]> {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las empresas: ', error);
        return [];
    }
}

export async function createEmpresa(nombre: string, cuit: number): Promise<number> {
    try {
        const response = await axios.post(BASE_URL,{
            "name": nombre,
            "cuit": cuit,
            "adm_dni":getAbmDni()
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