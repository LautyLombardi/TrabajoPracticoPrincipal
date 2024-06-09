import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Visitante } from '@/api/model/interfaces';

function useLogin(dni: number, name: string, lastname: string, email: string) {
    const db = useSQLiteContext();
    console.log('data', dni, name, lastname, email);

    const visitorQuery = useQuery({
        queryKey: ['visitor'],
        queryFn: async (): Promise<number> => {
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
        },
    });

    return {
        visitor: visitorQuery.data,
        isLoading: visitorQuery.isLoading,
        isError: visitorQuery.isError,
        error: visitorQuery.error,  // Para acceder al error si ocurre
    };
}

export default useLogin;
