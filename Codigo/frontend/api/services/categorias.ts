import axios, { AxiosResponse } from 'axios';
import { Categoria } from '../model/interfaces';
import { URL } from '@/api/constantes'
const BASE_URL = `${URL}/category`;

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
export const crearCategoria = async (nombre: string, descripcion: string, isExtern: number): Promise<void> => {
  try {
    const data: Categoria = {
      name: nombre,
      description: descripcion,
      isExtern: isExtern
    };

    const response = await fetch(BASE_URL, {
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