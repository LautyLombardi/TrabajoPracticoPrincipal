interface Usuario{  
    id: number,
    name: string,
    lastname: string,
    rol: string,
}

export interface Visitante{
    id: number,
    name: string,
    lastname: string,
    places: string[],
    institutos?: string[],
    empresa?: string,
    category: string,
}

// Definición de la interfaz para la entidad Categoria
export interface Categoria {
    id?: number | undefined; // Opcional, en caso de tener un identificador
    name: string;
    description: string;
    isExtern: number; // Nuevo atributo
    createDate?: string;
  }
  
export interface Instituto {
id?: number;
    nombre: string;
    lugares: string[];
}

export interface Rol {
    id?: number | undefined,
    name: string,
    description: string,
    createDate?: string,
}