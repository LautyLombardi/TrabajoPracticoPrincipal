import axios from 'axios';
import { Logs } from '../model/interfaces';
import { URL} from '@/api/constantes'
import { getAdmDni } from './storage';
const BASE_URL = `${URL}/logs`;

export async function getLogs(): Promise<Logs[]> {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los logs: ', error);
        return [];
    }
}

export async function logimageUser(dniUser: string): Promise<number> {
    try {
        const admDni = await getAdmDni();
        const response = await axios.post(`${BASE_URL}/image/user`,{
            "abm_dni": admDni,
            "user_dni": dniUser
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        console.error('Error al cargar log: ', error);
        return 400;
    }
}

export async function logimageVisitor(visitor_dni: string): Promise<number> {
    try {
        const admDni = await getAdmDni();
        const response = await axios.post(`${BASE_URL}/image/visitor`,{
            "abm_dni": admDni,
            "visitor_dni": visitor_dni,
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        console.error('Error al cargar log: ', error);
        return 400;
    }
}

export async function logfacerecognitionUser(hasAccess: number): Promise<number> {
    try {
        const admDni = await getAdmDni();
        const response = await axios.post(`${BASE_URL}/loginfacerecognition/user`,{
            "user_dni": admDni,
            "hasAccess": hasAccess
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        console.error('Error al cargar log: ', error);
        return 400;
    }
}

export async function logfacerecognitionAdmFail(): Promise<number> {
    try {
        const admDni = await getAdmDni();
        const response = await axios.post(`${BASE_URL}/loginfacerecognition/user`,{
            "user_dni": admDni, 
            "hasAccess": 0
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        console.error('Error al cargar log: ', error);
        return 400;
    }
}

export async function logfacerecognitionVisitor(hasAccess: number, visitor_dni: number): Promise<number> {
    try {
        const admDni = await getAdmDni();
        const response = await axios.post(`${BASE_URL}/loginfacerecognition/visitor`,{
            "abm_dni": admDni,
            "visitor_dni": visitor_dni,
            "hasAccess": hasAccess
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        console.error('Error al cargar log: ', error);
        return 400;
    }
}



export async function logLoginManual(client_dni: String, table_client:String): Promise<number> {
    try {
        const response = await axios.post(`${BASE_URL}/manualregistration`,{
            "client_dni": client_dni,
            "table_client": table_client
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        console.error('Error al cargar log: ', error);
        return 400;
    }
}

export async function logLoginManuaFail(client_dni: string, table_client:String): Promise<number> {
    try {
        const response = await axios.post(`${BASE_URL}/manualregistrationFail`,{
            "client_dni": parseInt(client_dni),
            "table_client": table_client
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        console.error('Error al cargar log: ', error);
        return 400;
    }
}