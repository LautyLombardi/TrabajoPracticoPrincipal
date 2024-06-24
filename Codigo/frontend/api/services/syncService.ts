import axios from 'axios';
import { ONLINE } from '@/api/constantes';
import { Categoria, Empresa, Excepcion, Instituto, Logs, Lugar, Usuario, Visitante } from '../model/interfaces';

const BASE_URL = `${ONLINE}/sync`;



export const syncUser = async (user: Usuario[]) => {
    const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    const data = await response.json();       
    return {status:response.status,data:data};

};

export const syncEnterprice = async (enterprice: Empresa[]) => {
    const response = await fetch(`${BASE_URL}/enterprices`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(enterprice)
    });
    const data = await response.json();       
    return {status:response.status,data:data};

};


export const syncPlace = async (places: Lugar[]) => {
    const response = await fetch(`${BASE_URL}/places`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(places)
    });
    const data = await response.json();       
    return {status:response.status,data:data};

};


export const syncInstitute = async (institutes: Instituto[]) => {
    const response = await fetch(`${BASE_URL}/institutes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(institutes)
    });
    const data = await response.json();       
    return {status:response.status,data:data};

};


export const syncCategories = async (categorias: Categoria[]) => {
    const response = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categorias)
    });
    const data = await response.json();       
    return {status:response.status,data:data};

};
export const syncVisitors = async (visitors: Visitante[]) => {
    const response = await fetch(`${BASE_URL}/visitors`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(visitors)
    });
    const data = await response.json();       
    return {status:response.status,data:data};

};

export const syncExceptions = async (excepciones: Excepcion[]) => {
    try {
        const response = await axios.post(`${BASE_URL}/exceptions`, {
            excepciones
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        console.error('Error al sincronizar excepciones :', error);
        return 400;
    }
};


export const syncLogs = async (logs: Logs[]) => {
    const response = await fetch(`${BASE_URL}/logs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(logs)
    });
    const data = await response.json();       
    return {status:response.status,data:data};

};

