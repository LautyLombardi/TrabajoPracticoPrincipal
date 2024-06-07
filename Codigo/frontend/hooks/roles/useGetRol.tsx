import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Rol } from '@/api/model/interfaces';

function useGetRol(roleId: number) {
    const db = useSQLiteContext();
    const rolQuery = useQuery({
        queryKey: ['role', roleId],
        queryFn: async (): Promise<Rol> => {
            const role = await db.getFirstAsync<Rol>(
                'SELECT * FROM role WHERE id = ?',
                [roleId]
            );
            if (!role) {
                throw new Error('Role not found');
            }
            return role;
        },
    });

    return {
        rol: rolQuery.data,
        isLoading: rolQuery.isLoading,
        isError: rolQuery.isError,
    };
}

export default useGetRol;