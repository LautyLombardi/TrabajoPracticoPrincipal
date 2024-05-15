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

// types.ts
export interface Categoria {
    id?: number; // id es opcional porque podría no estar presente en la carga útil de la solicitud
    nombre: string;
    lugares: string[];
}
