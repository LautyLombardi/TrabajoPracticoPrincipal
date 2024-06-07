import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Rol } from '@/api/model/interfaces';

const useGetRoles = () => {
    const db = useSQLiteContext();

    const rolesQuery = useQuery<Rol[]>({
        queryKey: ['roles'],
        queryFn: (): Promise<Rol[]> =>
            db.getAllAsync('SELECT * FROM role ORDER BY createDate'),
    });

    return {
        roles: rolesQuery.data,
        isLoading: rolesQuery.isLoading,
        isError: rolesQuery.isError,
    };
}

export default useGetRoles

