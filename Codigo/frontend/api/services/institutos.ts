// serviceInstitutos.ts
import axios from 'axios';
import { Instituto } from '@/api/model/interfaces';

const BASE_URL = 'http://localhost:3000/institutos'; // Reemplaza con la URL de tu API

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

export const createInstituto = async (instituto: Instituto): Promise<Instituto> => {
    try {
        const response = await axios.post(BASE_URL, instituto, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error al crear el instituto');
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
