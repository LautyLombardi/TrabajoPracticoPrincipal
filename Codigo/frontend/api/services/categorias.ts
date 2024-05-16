import axios, { AxiosResponse } from 'axios';
import { Categoria } from '../model/interfaces';

// URL base de la API
const API_URL = 'http://192.168.1.44:5000/category';

// Función para obtener todas las categorías
export async function obtenerCategorias(): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    return [];
  }
}

// Funcion para crear una categoria
export const crearCategoria = async (nombre: string, descripcion: string, isExtern: number): Promise<void> => {
  try {
    const url = 'http://192.168.248.170:5000/category/';
    const data: Categoria = {
      name: nombre,
      description: descripcion,
      isExtern: isExtern
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

// Función para actualizar una categoría existente
export async function actualizarCategoria(id: number | undefined, categoria: Categoria): Promise<Categoria | null> {
  try {
    const response: AxiosResponse<Categoria> = await axios.put(`${API_URL}/${id}`, categoria);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    return null;
  }
}

export const desactivarCategoria = async (id: number): Promise<void> => {
  try {
    const url = `http://192.168.1.44:5000/category/desactivate/${id}`;

    const response = await fetch(url, {
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