import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Rol } from '@/api/model/interfaces';

const useGetRolesData = () => {
  const db = useSQLiteContext();

  const rolesQuery = useQuery<Rol[]>({
    queryKey: ['roles'],
    queryFn: async (): Promise<Rol[]> => {
      return db.getAllAsync('SELECT * FROM role ORDER BY createDate');
    },
  });

  console.log(rolesQuery.data)
  return {
    rolies: rolesQuery.data,
    isLoading: rolesQuery.isLoading,
    isError: rolesQuery.isError,
  };
}

export default useGetRolesData;
