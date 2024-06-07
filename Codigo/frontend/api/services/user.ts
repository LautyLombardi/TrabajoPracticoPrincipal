import axios from 'axios';
import { URL } from '@/api/constantes'
import { Usuario } from '../model/interfaces';
import { getRolesById } from './roles';
import { getAdmDni } from './storage';

const BASE_URL = `${URL}/user`;

export const createUsuario = async (
    dni: number,
    role_id: number,
    name: string,
    lastname: string,
    password: string): Promise<number> => {
    try {
        const admDni = await getAdmDni();
        const data = {
            dni: dni,
            role_id: role_id,
            name: name,
            lastname: lastname,
            password: password,
            adm_dni:admDni

        };
        console.log(data)
        const response = await axios.post(BASE_URL, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status !== 201) {
            throw new Error('Error al crear el usuario');
        }
        return response.status;
    } catch (error) {
        console.error('Error en createUsuario:', error);
        throw error;
    }
};

export async function loginUser(dni: string, password: string): Promise<number> {
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
export async function getUserById (dni:number):Promise<string>{
    try {
        const response = await axios.get(`${BASE_URL}/${dni}`);
        console.log(response.data.role_id)
        const rol= await getRolesById(response.data.role_id);
        console.log(rol)
        return rol.name;
    } catch (error) {
        console.error('Error al realizar logueo: ', error);
        throw new Error(`Error al obtener el rol con id ${dni}`)
    }
}
