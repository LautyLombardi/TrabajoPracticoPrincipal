export function fechaToString(fecha: Date) : string {
    return fecha.getDate() + "/" + fecha.getMonth() + "/" + fecha.getFullYear();
}