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
    const response = await fetch(`${BASE_URL}/exceptions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(excepciones)
    });
    const data = await response.json();       
    return {status:response.status,data:data};
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

export const syncVisitor_history = async (visitor_history: any[]) => {
    const response = await fetch(`${BASE_URL}/visitor-histories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(visitor_history)
    });
    const data = await response.json();       
    return {status:response.status,data:data};
};

export const syncUser_history = async (user_history: any[]) => {
    const response = await fetch(`${BASE_URL}/user-histories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user_history)
    });
    const data = await response.json();       
    return {status:response.status,data:data};
};

