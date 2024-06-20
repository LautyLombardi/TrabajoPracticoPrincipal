import { useSQLiteContext } from '@/context/SQLiteContext';
import { Visitante } from '@/api/model/interfaces';
import { useCallback } from 'react';

function useLogin() {
    const db = useSQLiteContext();

    const loginHook = useCallback(async (dni: number, name: string, lastname: string, email: string)=>{
        console.log('data', dni, name, lastname, email);
        try {
            const visitor = await db.getFirstAsync<Visitante>(
                'SELECT * FROM visitor WHERE dni = ? AND name = ? AND lastname = ? AND email = ?',
                [dni, name, lastname, email]
            );
    
            console.log('visitor', visitor);
            if (visitor) {
                return 1;
            } else {
                // Contraseña incorrecta
                return 0;
            }
        } catch (error) {
            console.log("Error en login")
            return 0;
        }
        
    }, [db])

    return loginHook;
}

export default useLogin;
