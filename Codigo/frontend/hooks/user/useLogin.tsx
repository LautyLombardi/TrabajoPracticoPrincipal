import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';

function useLogin() {
    const db = useSQLiteContext();
    
    const loginHook = useCallback(async (dni: number, password: string) =>{
        console.log('data', dni, password);
        
        try {
            const nameDB = await db.getFirstAsync<{ name: string }>(
                'SELECT name FROM user WHERE dni = ? AND password = ?',
                [dni,password]
            );

            console.log('nameDB:', nameDB);
            if (nameDB) {
                return 1;
            } else {
                return 0;
            }
        } catch (error) {
            console.log("Error en login")
            return 0;
        }
    }, [db]);

    return loginHook;
}

export default useLogin;
