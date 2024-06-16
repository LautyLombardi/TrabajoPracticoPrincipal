import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Usuario } from '@/api/model/interfaces';

const useGetUsers = () => {
    const db = useSQLiteContext();

    const usersQuery = useQuery<Usuario[]>({
        queryKey: ['Usuarios'],
        queryFn: async (): Promise<Usuario[]> => {
            const results = await db.getAllAsync(`
                SELECT User.*, Role.name AS roleName
                FROM User
                INNER JOIN Role ON User.role_id = Role.id
                ORDER BY User.createDate DESC
            `);

            // Parsear los resultados y mapearlos a objetos de usuario
            const users: Usuario[] = results.map((row: any) => ({
                dni: row.dni,
                name: row.name,
                role_id: row.role_id,
                lastname: row.lastname,
                isActive: row.isActive,
                motive: row.motive,
                activeData: row.activeData,
                createDate: row.createDate,
                rolName: row.roleName, 
            }));

            return users;
        },
    });

    console.log('users data: ', usersQuery.data);
    
    return {
        users: usersQuery.data,
        isLoading: usersQuery.isLoading,
        isError: usersQuery.isError,
        refetch: usersQuery.refetch
    };
}

export default useGetUsers;