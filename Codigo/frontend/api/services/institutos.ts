// serviceInstitutos.ts
import axios from 'axios';
import { Instituto } from '@/api/model/interfaces';
import { URL } from '@/api/constantes'
const BASE_URL = `${URL}/institute`;
import { getAdmDni } from './storage';

export const getInstitutos = async (): Promise<Instituto[]> => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener los institutos');
    }
};

export const getInstitutoById = async (id: number): Promise<Instituto> => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener el instituto con id ${id}`);
    }
};


export const createInstituto = async (instituto: string, lugaresId: number[]): Promise<any> => {
    try {
        const admDni = await getAdmDni();
        const response = await axios.post(BASE_URL, {
            "name":instituto,
            "adm_dni":admDni
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if(response.data){
            lugaresId.forEach(async(id)=>await createInstitutePlace(response.data.id,id))
        }

    } catch (error) {
        throw new Error('Error al crear el instituto: ' + error);
    }
};

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