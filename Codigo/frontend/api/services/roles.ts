import axios, { AxiosResponse } from 'axios';
import { Rol } from '../model/interfaces';
const API_URL = 'http://192.168.1.44:5000/role';

export async function obtenerRoles(): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    return [];
  }
}

export const crearRol = async (nombre: string, descripcion: string): Promise<void> => {
    try {
      const url = 'http://192.168.1.44:5000/role/';
      const data: Rol = {
        name: nombre,
        description: descripcion,
      };
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error('Error al registrar la categoría');
      }
  
      // Si se registró correctamente, no necesitamos devolver ningún dato adicional
    } catch (error) {
      console.error('Error al registrar la categoría:', error);
      throw new Error('Error al registrar la categoría');
    }
  };