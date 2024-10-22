import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useInsertCategory = () => {
    const db = useSQLiteContext();

    const insertCategory = useCallback(async (name: string, description: string, isExtern: number, placeIds: number[]) => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar', name, description , isExtern, placeIds);

        try {
            await db.execAsync('BEGIN TRANSACTION;');
            
            const isExist = await db.getFirstAsync(`SELECT * FROM category WHERE name = ?;`, [name]);

            if (isExist) {
                await db.execAsync('ROLLBACK;');
                console.log('Category already exist');
                return -1;
            } 

             // Insert query
            const result = await db.runAsync(
                `INSERT INTO category (name, description,isExtern,isActive, createDate) VALUES (?, ?, ?, 1, ?);`,
                [name, description, isExtern, createDate]
            );
            const categoryId = result.lastInsertRowId;
            
            placeIds.forEach(async placeId=>{
                await db.runAsync(
                    `INSERT INTO category_place (category_id, place_id)
                        SELECT ?, ?
                        WHERE NOT EXISTS (
                            SELECT 1 FROM category_place WHERE category_id = ? AND place_id = ?
                    );`,
                    [categoryId, placeId, categoryId, placeId]
                );
            })
            
            await db.execAsync('COMMIT;');

            console.log('Category inserted with ID:', categoryId);
            return categoryId;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting Category:', error);
            return 0;
        }
    }, [db]);

    return insertCategory;
};
export default useInsertCategory;