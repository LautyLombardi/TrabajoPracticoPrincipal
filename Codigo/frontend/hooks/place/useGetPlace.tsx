import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Lugar } from '@/api/model/interfaces';

function useGetPlace(placeId: number) {
    const db = useSQLiteContext();
    const placeQuery = useQuery({
        queryKey: ['place', placeId],
        queryFn: async (): Promise<Lugar> => {
            const role = await db.getFirstAsync<Lugar>(
                'SELECT * FROM place WHERE id = ?',
                [placeId]
            );
            if (!role) {
                throw new Error('Role not found');
            }
            return role;
        },
    });

    return {
        place: placeQuery.data,
        isLoading: placeQuery.isLoading,
        isError: placeQuery.isError,
    };
}

export default useGetPlace;