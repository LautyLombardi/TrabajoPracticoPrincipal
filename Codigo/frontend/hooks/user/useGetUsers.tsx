import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Usuario } from '@/api/model/interfaces';

const useGetUsers = () => {
    const db = useSQLiteContext();

    const query = useQuery<Usuario[]>({
        queryKey: ['Usuarios'],
        queryFn: async (): Promise<Usuario[]> => {
            const results = await db.getAllAsync(`
                SELECT User.*, Role.name AS roleName
                FROM User
                INNER JOIN Role ON User.role_id = Role.id
                ORDER BY User.createDate
            `);

            // Parsear los resultados y mapearlos a objetos de usuario
            const users: Usuario[] = results.map((row: any) => ({ // Especificar 'any' aquí si TypeScript no puede inferir los tipos correctamente
                dni: row.dni,
                name: row.name,
                role_id: row.role_id,
                lastname: row.lastname,
                username: row.username,
                isActive: row.isActive,
                motive: row.motive,
                activeData: row.activeData,
                createDate: row.createDate,
                rolName: row.roleName, // Aquí asignamos el nombre del rol
            }));

            return users;
        },
    });

    return query;
}

export default useGetUsers;
