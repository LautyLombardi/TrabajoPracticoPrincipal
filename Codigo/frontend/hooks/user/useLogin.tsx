import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';

function useLogin(dni: number, password: string) {
    const db = useSQLiteContext();
    console.log('data', dni, password);

    const userQuery = useQuery({
        queryKey: ['user', dni],
        queryFn: async (): Promise<number> => {
            const passwordDB = await db.getFirstAsync<{ password: string }>(
                'SELECT password FROM user WHERE dni = ?',
                [dni]
            );

            console.log('passwordDB', passwordDB);
            if (passwordDB) {
                if (passwordDB.password == password) {
                    return 1;
                } else {
                    // Contraseña incorrecta
                    return 0;
                }
            } else {
                return 2;
            }
        },
    });

    return {
        user: userQuery.data,
        isLoading: userQuery.isLoading,
        isError: userQuery.isError,
        error: userQuery.error,  // Para acceder al error si ocurre
    };
}

export default useLogin;
