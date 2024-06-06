import axios from 'axios';
import { Lugar } from '@/api/model/interfaces';
import { URL } from '@/api/constantes'
const BASE_URL = `${URL}/place`;
import { getAdmDni } from './storage';

export async function createLugar(name: string, abbreviation: string, description: string, openTime: string, closeTime: string): Promise<number> {
    try {
        const admDni = await getAdmDni();
        const response = await axios.post(BASE_URL,{
            "name": name,
            "abbreviation": abbreviation,
            "description": description,
            "openTime": openTime,
            "closeTime": closeTime,
            "adm_dni":admDni
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        console.error('Error al crear lugar: ', error);
        return 400
    }
}