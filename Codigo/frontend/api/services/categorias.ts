import axios, { AxiosResponse } from 'axios';
import { Categoria } from '../model/interfaces';
import { URL } from '@/api/constantes'
const BASE_URL = `${URL}/category`;
import { getAdmDni } from './storage';

// Función para obtener todas las categorías
export async function obtenerCategorias(): Promise<Categoria[]> {
  try {
    const response: AxiosResponse<any> = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    return [];
  }
}

// Funcion para crear una categoria
export const crearCategoria = async (nombre: string, descripcion: string, isExtern: number): Promise<number> => {
  try {
    const admDni = await getAdmDni();
    const data = {
      name: nombre,
      description: descripcion,
      isExtern: isExtern,
      adm_dni:admDni
    };

    const response = await axios.post(BASE_URL, data, {
    });
    if (response.status !== 201) {
      throw new Error('Error al registrar la categoría');
    }
    return response.status;

  } catch (error) {
    console.error('Error al registrar la categoría:', error);
    throw new Error('Error al registrar la categoría');
  }
};

// Función para actualizar una categoría existente
export async function actualizarCategoria(id: number | undefined, categoria: Categoria): Promise<Categoria | null> {
  try {
    const response: AxiosResponse<Categoria> = await axios.put(`${BASE_URL}/${id}`, categoria);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    return null;
  }
}

export const desactivarCategoria = async (id: number): Promise<void> => {
  try {

    const response = await fetch( `${BASE_URL}/desactivate/${id}`, {
      method: 'PUT'
    });

    if (!response.ok) {
      throw new Error('Error al desactivar la categoría');
    }

    // Si se desactivó correctamente, no necesitamos devolver ningún dato adicional
  } catch (error) {
    console.error('Error al desactivar la categoría:', error);
    throw new Error('Error al desactivar la categoría');
  }
};

export async function createVisitorCategoria(id: number, dni: number): Promise<void> {
  try {
    const response = await axios.post(`${BASE_URL}/visitor`, {
      "visitor_dni": dni,
      "category_id": id
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201) {
      throw new Error('Error al crear el visitante');
    }
    return response.data;
  } catch (error) {
    console.error('Error en createVisitante:', error);
    throw error;
  }
}
