import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Lugar } from '@/api/model/interfaces';

const useGetPlaces = () => {
    const db = useSQLiteContext();

    const query = useQuery<Lugar[]>({
        queryKey: ['places'],
        queryFn: (): Promise<Lugar[]> =>
          db.getAllAsync('SELECT * FROM place ORDER BY createDate'),
    });

    return query;
}

export default useGetPlaces