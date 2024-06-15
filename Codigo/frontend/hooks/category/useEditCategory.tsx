import { useSQLiteContext } from '@/context/SQLiteContext';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

const useEditCategory = () => {
    const db = useSQLiteContext();
    const queryClient = useQueryClient();

    const getCategory = useCallback(async ( id: number,name: string, descripcion : string) => {
        try {
            await db.execAsync('BEGIN TRANSACTION;');

            const resultUpdate = await db.runAsync(
                `UPDATE category SET name = ? , description = ? WHERE id = ?;`,
                [ name, descripcion, id]
            )

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

