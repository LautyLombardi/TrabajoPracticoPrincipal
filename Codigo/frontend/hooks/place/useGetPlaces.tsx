import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Lugar } from '@/api/model/interfaces';

const useGetPlaces = () => {
    const db = useSQLiteContext();

    const placesQuery = useQuery<Lugar[]>({
        queryKey: ['places'],
        queryFn: (): Promise<Lugar[]> => {
            return db.getAllAsync('SELECT * FROM place ORDER BY createDate DESC');
        },
        refetchOnWindowFocus: true, // Refetch al volver al foco
        refetchOnMount: true,
    });
    
    console.log('places data: ', placesQuery.data);


    console.log('places data: ', placesQuery.data);

    return {
        places: placesQuery.data,
        isLoading: placesQuery.isLoading,
        isError: placesQuery.isError,
        refetch:placesQuery.refetch,
    };
}

export default useGetPlaces