// serviceCategorias.ts
import { Categoria } from '@/api/model/interfaces';
import { URL } from '@/api/constantes'
const BASE_URL = `${URL}categorias`; // Reemplaza con la URL de tu API

export const getCategorias = async (): Promise<Categoria[]> => {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error('Error al obtener las categorías');
    }
    return response.json();
};

export const getCategoriaById = async (id: number): Promise<Categoria> => {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
        throw new Error(`Error al obtener la categoría con id ${id}`);
    }
    return response.json();
};

export const createCategoria = async (categoria: Categoria): Promise<Categoria> => {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoria)
    });
    if (!response.ok) {
        throw new Error('Error al crear la categoría');
    }
    return response.json();
};

export const updateCategoria = async (id: number, categoria: Categoria): Promise<Categoria> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoria)
    });
    if (!response.ok) {
        throw new Error(`Error al actualizar la categoría con id ${id}`);
    }
    return response.json();
};

export const deleteCategoria = async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Error al eliminar la categoría con id ${id}`);
    }
};
