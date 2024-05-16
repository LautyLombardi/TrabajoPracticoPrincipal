import axios, { AxiosResponse } from 'axios';
import { Rol } from '../model/interfaces';
const API_URL = ' http://192.168.248.170:5000/role';

export async function obtenerRoles(): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    return [];
  }
}

export const crearRol = async (nombre: string, descripcion: string) => {
    try {
      const url = 'http://192.168.248.170:5000/role/';
      const data = {
        name: nombre,
        description: descripcion,
      };
  
      const response = await axios.post(url, data, {
      });
  
      // Si se registró correctamente, no necesitamos devolver ningún dato adicional
    } catch (error) {
      console.error('Error al registrar la categoría:', error);
      throw new Error('Error al registrar la categoría');
    }
};
