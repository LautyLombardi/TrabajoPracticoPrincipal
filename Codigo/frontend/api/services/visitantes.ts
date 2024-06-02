import axios from 'axios';
import { Instituto, Visitante } from '@/api/model/interfaces';
import { URL } from '@/api/constantes'
import { createVisitorCategoria } from './categorias';
import { getAdmDni } from './storage';

const BASE_URL = `${URL}/visitor`; 

export const getVisitantes = async (): Promise<Visitante[]> => {
    try {
        const response = await axios.get(BASE_URL);
        
        return response.data;
    } catch (error) {
        console.error('Error al obtener visitantes:', error);
        throw new Error('Error al obtener los visitantes');
    }
};

export const getVisitorById = async (id: number): Promise<Visitante> => {
    const response = await axios.post(`${BASE_URL}/${id}`);
    if (response.status !== 200) {
        throw new Error(`Error al obtener la visitante con id ${id}`);
    }
    return response.data;
};

export const createVisitante = async (
    dni: number,
    empresaId: number,
    categoriaId: number,
    name: string,
    lastname: string,
    email: string,
    password: string,
    startDate: Date,
    finishDate: Date): Promise<number> => {
    try {
        const admDni = await getAdmDni();
        const data = {
            dni: dni,
            enterprice_id: empresaId,
            name: name,
            lastname: lastname,
            email: email,
            password: password,
            startDate: formatDate(startDate),
            finishDate: formatDate(finishDate),
            adm_dni:admDni
        };
        console.log(data)
        const response = await axios.post(BASE_URL, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status !== 201) {
            throw new Error('Error al crear el visitante');
        }else{
            await createVisitorCategoria(categoriaId, dni)
        }
        return response.status;
    } catch (error) {
        console.error('Error en createVisitante:', error);
        throw error;
    }
};

export const updateVisitante = async (id: number, visitante: Visitante): Promise<void> => {
    const response = await axios.put(`${BASE_URL}/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(visitante)
    });
    if (response.status !== 200) {
        throw new Error(`Error al actualizar el visitante con id ${id}`);
    }
    return response.data;
};

export const desactiveVisitor = async (id: number): Promise<void> => {
    const response = await axios.put(`${BASE_URL}/desactive/${id}`);
    if (response.status !== 200) {
        throw new Error(`Error al desactivar el visitante con id ${id}`);
    }
};

export const activateVisitor = async (id: number): Promise<void> => {
    const response = await axios.put(`${BASE_URL}/active/${id}`);
    if (response.status !== 200) {
        throw new Error(`Error al activar el visitante con id ${id}`);
    }
};

export const getCategoryByVisitante = async (id:number):Promise<any>=>{
    const response = await axios.get(`${BASE_URL}/${id}/category`);
    if (response.status !== 200) {
        throw new Error(`Error al desactivar el visitante con id ${id}`);
    }
    /* console.log(response.data.name) */
    return response.data.name
}

export const instituteVisitor = async (id: number): Promise<Instituto[]> => {
    const response = await axios.get(`${BASE_URL}/${id}/institute`);
    if (response.status !== 200) {
        throw new Error(`Error al encontrar institutos parael visitante con id ${id}`);
    }
    return response.data
};

export async function loginVisitor(dni: string, password: string): Promise<number> {
    try {
        const response = await axios.post(`${BASE_URL}/login`,{
            "dni": dni,
            "password": password
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        console.error('Error al realizar logueo: ', error);
        return 400
    }
}

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${year}-${month}-${day}`;
  };