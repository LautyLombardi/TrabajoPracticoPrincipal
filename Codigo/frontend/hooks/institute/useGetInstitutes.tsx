import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Instituto } from '@/api/model/interfaces';
import { useEffect } from 'react';

const useGetInstitutes = () => {
    const db = useSQLiteContext();
    const queryClient = useQueryClient();

    const institutesQuery = useQuery<Instituto[]>({
        queryKey: ['institutes'],
        queryFn: async (): Promise<Instituto[]> => {
            return db.getAllAsync('SELECT * FROM institute ORDER BY createDate');
        },
        refetchOnWindowFocus: true, // Refetch al volver al foco
        refetchOnMount: true, // Refetch al montar el componente
    });
    
    const getCategory = async (institute: Instituto, instituteId: number): Promise<Instituto> => {
        const placeInstitute = await db.getAllAsync<{ place_id: number }>(
            `SELECT place_id FROM institute_place WHERE institute_id = ?`,
            [instituteId]
        ) as { place_id: number }[];
        
        const placeIds = placeInstitute.map(place => place.place_id);
        
        const placeNames = await db.getAllAsync<{ name: string }>(
            `SELECT name FROM place WHERE id IN (${placeIds.join(',')})`
        ) as { name: string }[];
        const placesName = placeNames.map(place => place.name);

        const updatedInstitute: Instituto = {
            ...institute,
            places: placesName,
        };
        
        return updatedInstitute;
    }

    useEffect(() => {
        if (institutesQuery.isSuccess && institutesQuery.data) {
            const fetchPlaceData = async () => {
                const updatedInstitutes = await Promise.all(institutesQuery.data.map(async (institute) => {
                    return await getCategory(institute, institute.id);
                }));
                
                queryClient.setQueryData<Instituto[]>(['institutes'], updatedInstitutes);
                
                console.log('institutes data: ', updatedInstitutes);
            };
            fetchPlaceData();
        }
    }, [institutesQuery.isSuccess, queryClient]);

    return {
        institutes: institutesQuery.data,
        isLoading: institutesQuery.isLoading,
        isError: institutesQuery.isError,
        refetch: institutesQuery.refetch,
    };
}

export default useGetInstitutes;
