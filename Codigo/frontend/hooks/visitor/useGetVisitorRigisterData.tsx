import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Categoria, Empresa, Instituto } from '@/api/model/interfaces';

const useGetVisitorRigisterData = () => {
    const db = useSQLiteContext();

    const categoriesQuery = useQuery<Categoria[]>({
        queryKey: ['categories'],
        queryFn: async (): Promise<Categoria[]> => {
            return db.getAllAsync('SELECT * FROM category ORDER BY createDate');
        },
    });
    const institutesQuery = useQuery<Instituto[]>({
        queryKey: ['institutes'],
        queryFn: async (): Promise<Instituto[]> => {
            return db.getAllAsync('SELECT * FROM institute ORDER BY createDate');
        },
    });
    const enterpricesQuery = useQuery<Empresa[]>({
        queryKey: ['enterprices'],
        queryFn: async (): Promise<Empresa[]> => {
            return db.getAllAsync('SELECT * FROM enterprice ORDER BY createDate');
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
