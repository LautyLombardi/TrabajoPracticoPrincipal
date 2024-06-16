import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';
import { Categoria } from '@/api/model/interfaces';


const useGetCategoryById = () => {
    const db = useSQLiteContext();

    const getCategory = useCallback(async (id : number) => {
        console.log('category by id', id);
        try {

            const categoryDB = await db.getFirstAsync<Categoria>(
                'SELECT * FROM category WHERE id = ?',
                [id]
            );

            const placeCategory = await db.getAllAsync<{ place_id: number }>(
                `SELECT place_id FROM category_place WHERE category_id = ?`,
                [id]
            );

            const placeIds = placeCategory.map(place => place.place_id);



            console.log('categoryDB by id', categoryDB);
            if (categoryDB && categoryDB !== null) {
                return {
                    category :categoryDB,
                    placeIds: placeIds,
                }
            } else {
                return undefined;
            }
        } catch (error) {
            console.error('Error updating category:', error);
            return undefined;
        }
    }, [db]);
    return getCategory;

};

export default useGetCategoryById;
