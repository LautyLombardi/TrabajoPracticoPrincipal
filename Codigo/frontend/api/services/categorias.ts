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

// Función para crear una nueva categoría
export async function crearCategoria(categoria: Categoria): Promise<Categoria | null> {
  try {
    const response: AxiosResponse<Categoria> = await axios.post(API_URL, categoria);
    return response.data;
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    return null;
  }
}

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

// Función para eliminar una categoría
export async function eliminarCategoria(id: number | undefined): Promise<boolean> {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    return false;
  }
}
