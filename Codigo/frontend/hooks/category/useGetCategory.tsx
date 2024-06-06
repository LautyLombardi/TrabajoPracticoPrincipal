import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Categoria } from '@/api/model/interfaces';

const useGetCategories = () => {
    const db = useSQLiteContext();

    const query = useQuery<Categoria[]>({
        queryKey: ['categories'],
        queryFn: (): Promise<Categoria[]> =>
          db.getAllAsync('SELECT * FROM category ORDER BY createDate'),
    });

    return query;
}

export default useGetCategories;