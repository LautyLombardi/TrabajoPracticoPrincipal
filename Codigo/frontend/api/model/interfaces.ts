interface Usuario{  
    id: number,
    name: string,
    lastname: string,
    rol: string,
}

export interface Lugar{
    id:number,
    name:string,
    abbreviation:string,
    description:string,
    openTime:string,
    closeTime:string,
    isActive?:number,
    createDate?:string
}

export interface Visitante{
    id: number,
    dni:number,
    name: string,
    lastname: string,
    places: string[],
    institutes?: string,
    empresa?: string,
    category: string,
}


export interface Empresa{
    id: number,
    name: string,
    cuit: number,
    isActive?:number,
    createDate?:string
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
    name: string;
    createDate: string;
}

export interface Rol {
    id?: number | undefined,
    name: string,
    description: string,
    createDate?: string,
}