import axios from 'axios';
import { Excepcion } from '../model/interfaces';
import { URL } from '@/api/constantes'
const BASE_URL = `${URL}/exception`;
import { getAdmDni } from './storage';

export async function createExcepcion(category_id: number, place_id: number, name: string, description: string, duration: string): Promise<number> {
    try {
        console.log({
            "category_id": category_id,
            "place_id": place_id,
            "name": name,
            "description": description,
            "duration": duration
        })
        const admDni = await getAdmDni();
        const response = await axios.post(BASE_URL,{
            "category_id": category_id,
            "place_id": place_id,
            "name": name,
            "description": description,
            "duration": duration,
            "adm_dni":admDni
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        console.error('Error al crear excepcion: ', error);
        return 400
    }
}