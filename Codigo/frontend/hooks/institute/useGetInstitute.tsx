import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';
import { Instituto } from '@/api/model/interfaces';

interface GetInstituteResult {
    institute: Instituto;
    placeIds: number[];
}

const useGetInstitute = () => {
    const db = useSQLiteContext();

    const getInstitute = useCallback(async (id: number): Promise<GetInstituteResult | undefined> => {
        console.log('instituto by id', id);
        try {
            const instituteDB = await db.getFirstAsync<Instituto>(
                'SELECT * FROM institute WHERE id = ?',
                [id]
            );
            const placeInstitute = await db.getAllAsync<{ place_id: number }>(
                `SELECT place_id FROM institute_place WHERE institute_id = ?`,
                [id]
            );

            const placeIds = placeInstitute.map(place => place.place_id);
            
            if (instituteDB && instituteDB !== null) {
                return {
                    institute: instituteDB,
                    placeIds: placeIds,
                };
            } else {
                return undefined;
            }
        } catch (error) {
            console.error('Error fetching institute:', error);
            return undefined;
        }
    }, [db]);

    return getInstitute;
};

export default useGetInstitute;
