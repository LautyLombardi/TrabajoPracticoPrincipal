import axios from 'axios';
import { URL } from '@/api/constantes'
import { Usuario } from '../model/interfaces';
import { getRolesById } from './roles';

const BASE_URL = `${URL}/user`;

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
