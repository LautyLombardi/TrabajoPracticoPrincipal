export interface Usuario{  
    dni: number,
    role_id: number,
    name: string,
    lastname: string,
    createDate:string,
    barcode: string,
    rol?: string,
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
    dni:number,
    enterprice_id:number,
    name: string,
    lastname: string,
    email: string,
    startDate: string,
    finishDate: string,
    isActive:number,
    createDate:string,
    isEnter:number,
    places?: string[],
    institutes?: string,
    empresa?: string,
    category?: string,
}

export interface Categoria {
    id: number; 
    name: string;
    description: string;
    isExtern: number;
    createDate?: string;
}

export interface Empresa{
    id: number,
    name: string,
    cuit: number,
    isActive?:number,
    createDate?:string
}

  
export interface Instituto {
    id?: number;
    name: string;
    createDate: string;
}

export interface Rol {
    id: number,
    name: string,
    description: string,
    createDate: string,
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