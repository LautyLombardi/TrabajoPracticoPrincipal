import axios from 'axios';
import { Lugar } from '@/api/model/interfaces';
import { URL } from '@/api/constantes'
const BASE_URL = `${URL}/place`;

export const getLugares = async (): Promise<Lugar[]> => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener los lugares');
    }
};

export async function createLugar(name: string, abbreviation: string, description: string, openTime: string, closeTime: string): Promise<number> {
    try {
        const response = await axios.post(BASE_URL,{
            "name": name,
            "abbreviation": abbreviation,
            "description": description,
            "openTime": openTime,
            "closeTime": closeTime
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