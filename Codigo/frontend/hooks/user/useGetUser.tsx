import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Usuario } from '@/api/model/interfaces';

function useGetUser(dni: number) {
    const db = useSQLiteContext();
    console.log('get user by dni', dni)
    const userQuery = useQuery({
        queryKey: ['user', dni],
        queryFn: async (): Promise<Usuario> => {
            const user = await db.getFirstAsync<Usuario>(
                'SELECT * FROM user WHERE dni = ?',
                [dni]
            );
            if (!user) {
                throw new Error('User not found');
            }
            console.log('user in hook', user)
            return user;
        },
    });

    return {
        user: userQuery.data,
        isLoading: userQuery.isLoading,
        isError: userQuery.isError,
    };
}

export default useGetUser;