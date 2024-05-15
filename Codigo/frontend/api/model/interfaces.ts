interface usuario{  
    id: number,
    name: string,
    lastname: string,
    rol: string,
}

interface visitante{
    id: number,
    name: string,
    lastname: string,
    places: string[],
    category: string,
}

// Definición de la interfaz para la entidad Categoria
export interface Categoria {
    id?: number | undefined; // Opcional, en caso de tener un identificador
    name: string;
    description: string;
    isExtern: boolean; // Nuevo atributo
    createDate: string;
  }
  
export interface Instituto {
id?: number;
    nombre: string;
    lugares: string[];
}