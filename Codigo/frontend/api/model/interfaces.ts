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
    createDate: any;
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
    id: number; // Opcional, en caso de tener un identificador
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

export interface Logs {
    id: string;
    userId: number;
    exceptionId: number;
    visitorId: number;
    hasAccess: number;
    isFaceRecognition: number;
    abm: string;
    abmType: string;
    description: string;
    aperturaCierre: string;
    createDate: string;
    isEnter: number;
    isAutomatic: number;
}

export interface Excepcion {
    id: number;
    user_id: number;
    name: string;
    description: string;
    duration: string;
    createDate: string;
    place_name: string;
    category_name: string;

}