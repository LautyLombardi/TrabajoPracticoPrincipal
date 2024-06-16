import { useSQLiteContext } from '@/context/SQLiteContext';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

const useEditCategory = () => {
    const db = useSQLiteContext();
    const queryClient = useQueryClient();

    const getCategory = useCallback(async ( id: number,name: string, descripcion : string, placeIds: number[]) => {
        try {
            await db.execAsync('BEGIN TRANSACTION;');

            const resultUpdate = await db.runAsync(
                `UPDATE category SET name = ? , description = ? WHERE id = ?;`,
                [ name, descripcion, id]
            )


            await db.runAsync(
                `DELETE FROM category_place WHERE category_id = ?;`,
                [id]
            );
           
          // Insertar nuevas relaciones en category_place
          for (const placeId of placeIds) {
            await db.runAsync(
                `INSERT INTO category_place (category_id, place_id)
                    SELECT ?, ?
                    WHERE NOT EXISTS (
                        SELECT 1 FROM category_place WHERE category_id = ? AND place_id = ?
                );`,
                [id, placeId, id, placeId]
            );
        }
            console.log('Update result:', resultUpdate);
            await db.execAsync('COMMIT;');

            queryClient.invalidateQueries({ queryKey: ['categories']});

            console.log('category updated successfully');
            return resultUpdate.lastInsertRowId;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error updating category:', error);
            return 0;
        }
    }, [db]);
    return getCategory;

};

export default useEditCategory;

