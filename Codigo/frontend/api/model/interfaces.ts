export interface Usuario{  
    dni: number,
    role_id: number,
    name: string,
    lastname: string,
    isActive:number,
    activeData: string,
    createDate:string,
    rolName: string,
}

export interface Lugar{
    id:number,
    name:string,
    abbreviation:string,
    description:string,
    openTime:string,
    closeTime:string,
    isActive:number,
    createDate:string
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
    isExtern: number;
    createDate:string,
    places?: string[],
    institutes?: string[],
    empresa?: string,
    category: string,
}

export interface Categoria {
    id: number; 
    name: string;
    description: string;
    isExtern: number;
    places: string[],
    institutes: string[],
    createDate: string;
    isActive : number;
}

export interface Empresa{
    id: number,
    name: string,
    cuit: number,
    isActive:number,
    createDate:string
}

export interface Instituto {
    id: number;
    name: string;
    places: string[],
    isActive:number,
    createDate: string;
}

export interface Rol {
    id: number;
    name: string;
    description: string;
    createDate: string;
    routingConnection:number; // usar como systemConfigs
    onlineLogin:number;
    offlineLogin:number;
    dayStartEnd:number;
    visitorAuthentication:number;
    visitorAuthorization:number;
    instituteConfiguration:number;
    entityABMs:number;
    systemReports:number;
    systemLog:number;
    exceptionLoading:number;
}

export interface Logs {
    id: string;
    admDni:number;
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
    isError: number;
}

export interface Excepcion {
    id: number;
    name: string;
    description: string;
    duration: string;
    createDate: string;
    place_names: string[];
    category_name: string;
}