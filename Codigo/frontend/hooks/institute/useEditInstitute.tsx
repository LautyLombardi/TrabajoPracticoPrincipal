import { useSQLiteContext } from '@/context/SQLiteContext';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

const useEditInstitute = () => {
    const db = useSQLiteContext();
    const queryClient = useQueryClient();

    const editInstitute = useCallback(async (id : number, name: string, placeIds: number[]) => {
        try {
            await db.execAsync('BEGIN TRANSACTION;');

            const resultUpdate = await db.runAsync(
                `UPDATE institute SET name = ? WHERE id = ?;`,
                [ name, id]
            )

            await db.runAsync(
                `DELETE FROM institute_place WHERE institute_id = ?;`,
                [id]
            );

            // Insertar nuevas relaciones en category_place
            for (const placeId of placeIds) {
                await db.runAsync(
                    `INSERT INTO institute_place (institute_id, place_id)
                        SELECT ?, ?
                        WHERE NOT EXISTS (
                            SELECT 1 FROM institute_place WHERE institute_id = ? AND place_id = ?
                    );`,
                    [id, placeId, id, placeId]
                );
            }
            console.log('Update result:', resultUpdate);

            await db.execAsync('COMMIT;');

            queryClient.invalidateQueries({ queryKey: ['institutes']});

            console.log('institute updated successfully');
            return resultUpdate.lastInsertRowId;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error updating institute:', error);
            return 0;
        }
    }, [db]);
    return editInstitute;

};

export default useEditInstitute;

