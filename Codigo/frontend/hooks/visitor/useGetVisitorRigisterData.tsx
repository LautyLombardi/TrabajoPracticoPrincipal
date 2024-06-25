import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Categoria, Empresa, Instituto } from '@/api/model/interfaces';

const useGetVisitorRigisterData = () => {
    const db = useSQLiteContext();

    const categoriesQuery = useQuery<Categoria[]>({
        queryKey: ['categories'],
        queryFn: async (): Promise<Categoria[]> => {
            return db.getAllAsync('SELECT * FROM category WHERE isActive = 1 ORDER BY createDate');
        },
    });
    const institutesQuery = useQuery<Instituto[]>({
        queryKey: ['institutes'],
        queryFn: async (): Promise<Instituto[]> => {
            return db.getAllAsync('SELECT * FROM institute WHERE isActive = 1 ORDER BY createDate');
        },
    });
    const enterpricesQuery = useQuery<Empresa[]>({
        queryKey: ['enterprices'],
        queryFn: async (): Promise<Empresa[]> => {
            return db.getAllAsync('SELECT * FROM enterprice WHERE isActive = 1 ORDER BY createDate');
        },
    });

    return {
        categories: categoriesQuery.data,
        institutes: institutesQuery.data,
        enterprices: enterpricesQuery.data,
        isLoading: categoriesQuery.isLoading,
        isError: categoriesQuery.isError,
    };
}

export default useGetVisitorRigisterData;
