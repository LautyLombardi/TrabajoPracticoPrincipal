import axios, { AxiosResponse } from 'axios';
import { Rol } from '../model/interfaces';
import { URL } from '@/api/constantes'
const BASE_URL = `${URL}/role`;

export async function obtenerRoles(): Promise<Rol[]> {
  try {
    const response = await axios.get(BASE_URL);
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    return [];
  }
}

export const crearRol = async (nombre: string, descripcion: string) => {
    try {
      const data = {
        name: nombre,
        description: descripcion,
      };
  
      const response = await axios.post(BASE_URL, data, {
      });

      // Si se registró correctamente, no necesitamos devolver ningún dato adicional
    } catch (error) {
      console.error('Error al registrar la categoría:', error);
      throw new Error('Error al registrar la categoría');
    }
};