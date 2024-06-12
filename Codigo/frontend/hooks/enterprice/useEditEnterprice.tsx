import { useSQLiteContext } from '@/context/SQLiteContext';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

const useEditEnterprice = () => {
    const db = useSQLiteContext();
    const queryClient = useQueryClient();

    const getEnterprice = useCallback(async (id : number, name: string, cuit : string) => {
        try {
            await db.execAsync('BEGIN TRANSACTION;');

            const resultUpdate = await db.runAsync(
                `UPDATE enterprice SET name = ? , cuit = ? WHERE id = ?;`,
                [ name, cuit, id]
            )

            console.log('Update result:', resultUpdate);

            await db.execAsync('COMMIT;');

            queryClient.invalidateQueries({ queryKey: ['enterprices']});

            console.log('enterprice updated successfully');
            return resultUpdate.lastInsertRowId;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error updating enterprice:', error);
            return 0;
        }
    }, [db]);
    return getEnterprice;

};

export default useEditEnterprice;

