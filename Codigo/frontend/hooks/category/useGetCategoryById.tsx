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
            console.log('categoryDB by id', categoryDB);
            if (categoryDB && categoryDB !== null) {
                return categoryDB;
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
