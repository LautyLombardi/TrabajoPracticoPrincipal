import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Lugar } from '@/api/model/interfaces';

const useGetPlaces = () => {
    const db = useSQLiteContext();

    const placesQuery = useQuery<Lugar[]>({
        queryKey: ['places'],
        queryFn: (): Promise<Lugar[]> =>
          db.getAllAsync('SELECT * FROM place ORDER BY createDate'),
    });

    return {
        places: placesQuery.data,
        isLoading: placesQuery.isLoading,
        isError: placesQuery.isError,
    };
}

export default useGetPlaces