// serviceInstitutos.ts
import axios from 'axios';
import { Instituto } from '@/api/model/interfaces';
import { URL } from '@/api/constantes'
const BASE_URL = `${URL}/institute`;
import { getAdmDni } from './storage';

export const updateInstituto = async (id: number, instituto: Instituto): Promise<Instituto> => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, instituto, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error al actualizar el instituto con id ${id}`);
    }
};

export const deleteInstituto = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${BASE_URL}/${id}`);
    } catch (error) {
        throw new Error(`Error al eliminar el instituto con id ${id}`);
    }
};

export const createInstitutePlace = async (instituteId: number, placeId: number): Promise<any> => {
    try {
        console.log("instituteId ", instituteId, " | ",  placeId ," placeId")
        const response = await axios.post(`${BASE_URL}/place`, {
            "institute_id": instituteId,
            "place_id": placeId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        } else {
            throw new Error('Error al conectar con el servidor');
        }
    }
};