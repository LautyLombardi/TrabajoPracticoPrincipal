import axios from 'axios';
import { Excepcion } from '../model/interfaces';
import { URL } from '@/api/constantes'
const BASE_URL = `${URL}/exception`;

export async function getExcepciones(): Promise<Excepcion[]> {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las empresas: ', error);
        return [];
    }
}

export async function createExcepcion(user_dni: number, category_id: number, place_id: number, name: string, description: string, duration: string): Promise<number> {
    try {
        const response = await axios.post(BASE_URL,{
            "user_dni": user_dni,
            "category_id": category_id,
            "place_id": place_id,
            "name": name,
            "description": description,
            "duration": duration
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