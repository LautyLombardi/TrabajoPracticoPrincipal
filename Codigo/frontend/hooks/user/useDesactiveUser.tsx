import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';
import { getCurrentCreateDate } from '@/util/getCreateDate';

const useDeactivateUser = () => {
    const db = useSQLiteContext();

    const deactivateUser = useCallback(async (userId: number) => {
        const finishDate=getCurrentCreateDate();
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Update query
            const result = await db.runAsync(
                `UPDATE user SET isActive = 0, finishDate = ? WHERE dni = ?;`,
                [finishDate, userId]
            );

            console.log('Update result:', result.changes);
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log('User Deactivated with ID:', userId);
                return userId;
            } else {
                console.warn('No User found with ID:', userId);
                return 0;
            }
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error Deactivating User:', error);
            return 0;
        }
    }, [db]);

    return deactivateUser;
};

export default useDeactivateUser;