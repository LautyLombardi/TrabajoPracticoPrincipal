import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Rol } from '@/api/model/interfaces';

function useGetRol(roleId: number) {
    const db = useSQLiteContext();
    const rolesQuery = useQuery({
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
        roles: rolesQuery.data,
        isLoading: rolesQuery.isLoading,
        isError: rolesQuery.isError,
    };
}

export default useGetRol;