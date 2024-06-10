import axios from 'axios';
import { URL} from '@/api/constantes'
import { getAdmDni } from './storage';
const BASE_URL = `${URL}/logs`;

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